type SeoPayload = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
};

const SITE_ORIGIN = (import.meta.env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/+$/, '');

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let node = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;

  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }

  node.setAttribute('content', content);
}

export function setSeo(payload: SeoPayload) {
  document.title = payload.title;

  if (payload.description) {
    upsertMeta('name', 'description', payload.description);
  }

  const pageUrl = payload.path ? `${SITE_ORIGIN}${payload.path.startsWith('/') ? payload.path : `/${payload.path}`}` : SITE_ORIGIN;
  upsertMeta('property', 'og:title', payload.title);
  if (payload.description) {
    upsertMeta('property', 'og:description', payload.description);
  }
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:url', pageUrl);

  if (payload.image) {
    upsertMeta('property', 'og:image', payload.image);
  }
}
