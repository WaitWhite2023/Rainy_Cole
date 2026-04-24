function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeUrl(rawUrl: string) {
  const url = rawUrl.trim();
  if (!url) return '#';
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(url)) {
    return url;
  }
  return '#';
}

function parseInline(markdown: string) {
  const codeTokens: string[] = [];
  let text = markdown.replace(/`([^`]+)`/g, (_, code: string) => {
    const token = `@@CODE_${codeTokens.length}@@`;
    codeTokens.push(`<code>${code}</code>`);
    return token;
  });

  text = text
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, src: string) => {
      return `<img src="${sanitizeUrl(src)}" alt="${alt}" />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, url: string) => {
      const href = sanitizeUrl(url);
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');

  return text.replace(/@@CODE_(\d+)@@/g, (_, index: string) => codeTokens[Number(index)] || '');
}

export function renderMarkdown(raw: string) {
  const normalized = escapeHtml(raw).replace(/\r\n?/g, '\n').trim();
  if (!normalized) return '';

  const fencedCodeBlocks: string[] = [];
  const withCodeTokens = normalized.replace(/```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g, (_, lang: string, code: string) => {
    const token = `@@BLOCK_CODE_${fencedCodeBlocks.length}@@`;
    const languageClass = lang ? ` class="language-${lang}"` : '';
    fencedCodeBlocks.push(`<pre><code${languageClass}>${code.trim()}</code></pre>`);
    return token;
  });

  const blocks = withCodeTokens.split(/\n{2,}/).map((item) => item.trim()).filter(Boolean);

  const html = blocks.map((block) => {
    if (/^@@BLOCK_CODE_\d+@@$/.test(block)) {
      return block;
    }

    if (/^#{1,6}\s+/.test(block)) {
      const match = block.match(/^(#{1,6})\s+([\s\S]+)$/);
      if (!match) return `<p>${parseInline(block)}</p>`;
      const level = match[1].length;
      return `<h${level}>${parseInline(match[2].trim())}</h${level}>`;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(block)) {
      return '<hr />';
    }

    const lines = block.split('\n');

    if (lines.every((line) => /^>\s?/.test(line))) {
      const content = lines.map((line) => line.replace(/^>\s?/, '')).join('<br />');
      return `<blockquote>${parseInline(content)}</blockquote>`;
    }

    if (lines.every((line) => /^[-*+]\s+/.test(line))) {
      const items = lines.map((line) => `<li>${parseInline(line.replace(/^[-*+]\s+/, ''))}</li>`).join('');
      return `<ul>${items}</ul>`;
    }

    if (lines.every((line) => /^\d+\.\s+/.test(line))) {
      const items = lines.map((line) => `<li>${parseInline(line.replace(/^\d+\.\s+/, ''))}</li>`).join('');
      return `<ol>${items}</ol>`;
    }

    return `<p>${parseInline(lines.join('<br />'))}</p>`;
  }).join('\n');

  return html.replace(/@@BLOCK_CODE_(\d+)@@/g, (_, index: string) => {
    return fencedCodeBlocks[Number(index)] || '';
  });
}
