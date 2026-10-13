/**
 * SEO helpers: a single pure description of a page's metadata that can be
 * either applied to the live DOM (client navigation) or rendered as HTML
 * (build-time prerender).
 */

export const SITE_NAME = 'SnapKit';
export const TAGLINE = 'Free Tools. Quick Results.';
export const DEFAULT_SITE_URL = 'https://snapkit.42web.io';

/** Canonical origin. Configurable via VITE_SITE_URL so the site can move to a custom domain. */
export function siteOrigin(): string {
  const raw = import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL;
  return raw.replace(/\/+$/, '');
}

/** Absolute canonical URL for an internal path (paths are kept slash-normalized). */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = normalizePathname(path);
  return `${siteOrigin()}${normalized}`;
}

/**
 * Normalize an internal pathname to its canonical form:
 * leading slash, trailing slash (except for the root), no duplicate slashes.
 * Query strings and hashes are dropped.
 */
export function normalizePathname(path: string): string {
  const withoutQuery = path.split('?')[0].split('#')[0];
  let p = withoutQuery.trim();
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/{2,}/g, '/');
  if (p !== '/' && !p.endsWith('/')) p = `${p}/`;
  return p;
}

export interface SeoInput {
  /** Full, unique title (site name is appended by the caller where wanted). */
  title: string;
  description: string;
  /** Canonical internal path. */
  path: string;
  /** Open Graph type. */
  type?: 'website' | 'article';
  /** Disallow indexing (used only for the live 404 page). */
  noindex?: boolean;
  jsonLd?: unknown[];
}

export interface SeoTag {
  title: string;
  metas: { key: 'name' | 'property'; name: string; content: string }[];
  links: { rel: string; href: string }[];
  jsonLd: unknown[];
}

/** Build the full tag set for a page. Pure — usable in DOM or string rendering. */
export function buildSeoTags(input: SeoInput): SeoTag {
  const url = absoluteUrl(input.path);
  const type = input.type ?? 'website';
  const metas: SeoTag['metas'] = [
    { key: 'name', name: 'description', content: input.description },
    { key: 'name', name: 'robots', content: input.noindex ? 'noindex, nofollow' : 'index, follow' },
    { key: 'property', name: 'og:site_name', content: SITE_NAME },
    { key: 'property', name: 'og:type', content: type },
    { key: 'property', name: 'og:title', content: input.title },
    { key: 'property', name: 'og:description', content: input.description },
    { key: 'property', name: 'og:url', content: url },
    { key: 'property', name: 'og:locale', content: 'en_US' },
    { key: 'name', name: 'twitter:card', content: 'summary' },
    { key: 'name', name: 'twitter:title', content: input.title },
    { key: 'name', name: 'twitter:description', content: input.description },
  ];
  return {
    title: input.title,
    metas,
    // A noindex page (404) never declares a canonical.
    links: input.noindex ? [] : [{ rel: 'canonical', href: url }],
    jsonLd: input.jsonLd ?? [],
  };
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${cssEscape(key)}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function cssEscape(value: string): string {
  return value.replace(/"/g, '\\"');
}

function upsertLink(rel: string, href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSON_LD_ID = 'snapkit-jsonld';

/** Apply a tag set to the live document (used on every client navigation). */
export function applySeoTags(tags: SeoTag): void {
  document.title = tags.title;
  for (const meta of tags.metas) upsertMeta(meta.key, meta.name, meta.content);
  for (const link of tags.links) upsertLink(link.rel, link.href);

  document.querySelectorAll(`script#${JSON_LD_ID}`).forEach((n) => n.remove());
  for (const block of tags.jsonLd) {
    const script = document.createElement('script');
    script.id = JSON_LD_ID;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Render a tag set as HTML head markup (used by the build-time prerender). */
export function renderHeadHtml(tags: SeoTag): string {
  const parts: string[] = [];
  parts.push(`<title>${escapeHtml(tags.title)}</title>`);
  for (const meta of tags.metas) {
    parts.push(
      `<meta ${meta.key}="${escapeHtml(meta.name)}" content="${escapeHtml(meta.content)}">`,
    );
  }
  for (const link of tags.links) {
    parts.push(`<link rel="${escapeHtml(link.rel)}" href="${escapeHtml(link.href)}">`);
  }
  for (const block of tags.jsonLd) {
    // JSON-LD is serialized from data, then made safe for <script> embedding.
    const json = JSON.stringify(block).replace(/</g, '\\u003c');
    parts.push(`<script type="application/ld+json">${json}</script>`);
  }
  return parts.join('\n    ');
}

/** BreadcrumbList matching the visible trail: Home + crumbs, current page last. */
export function breadcrumbTrailJsonLd(
  currentPath: string,
  items: { name: string; path?: string }[],
): unknown {
  const trail = [
    { name: 'Home', path: '/' },
    ...items.map((item, index) => ({
      name: item.name,
      path: item.path ?? (index === items.length - 1 ? currentPath : undefined),
    })),
  ].filter((item): item is { name: string; path: string } => Boolean(item.path));
  return breadcrumbJsonLd(trail);
}

/** FAQPage JSON-LD for an FAQ section that is visibly rendered on the page. */
export function faqJsonLd(items: { question: string; answer: string }[]): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

/** JSON-LD for the site as a whole (accurate: describes visible site content only). */
export function websiteJsonLd(): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteOrigin(),
    description: 'Free browser-based image and text tools.',
    alternateName: TAGLINE,
  };
}

/** Breadcrumb JSON-LD matching the visible breadcrumb trail. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]): unknown {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
