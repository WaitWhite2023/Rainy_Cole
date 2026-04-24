import DOMPurify from 'dompurify';
import markdownit from 'markdown-it';

const md = markdownit({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true
});

const defaultLinkRenderer =
  md.renderer.rules.link_open ||
  ((tokens, index, options, _env, self) => self.renderToken(tokens, index, options));

md.renderer.rules.link_open = (tokens, index, options, env, self) => {
  tokens[index].attrSet('target', '_blank');
  tokens[index].attrSet('rel', 'noopener noreferrer');
  return defaultLinkRenderer(tokens, index, options, env, self);
};

export function renderMarkdown(raw: string) {
  const source = raw?.trim() || '';
  if (!source) return '';
  const html = md.render(source);
  return DOMPurify.sanitize(html);
}
