import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from './App';
import { allRoutes, findRoute } from './lib/routes';
import { GUIDE_META, guidePath } from './lib/guides';
import {
  buildSeoTags,
  normalizePathname,
  renderHeadHtml,
  siteOrigin,
  websiteJsonLd,
} from './lib/seo';

export interface RenderedPage {
  html: string;
  head: string;
  path: string;
  status: number;
}

/** Render one URL to HTML plus its static <head> metadata. */
export function render(url: string): RenderedPage {
  const path = normalizePathname(url);
  const route = findRoute(path);
  const isHome = path === '/';

  const html = renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>,
  );

  const tags = buildSeoTags({
    title: route?.title ?? 'Page Not Found | SnapKit',
    description:
      route?.description ??
      'This page does not exist. Browse the free tools and guides available on SnapKit.',
    path: route ? route.path : path,
    noindex: route ? route.noindex === true : true,
    jsonLd: isHome ? [websiteJsonLd()] : [],
  });

  return { html, head: renderHeadHtml(tags), path, status: route ? 200 : 404 };
}

/** Every canonical, indexable path (used for sitemap + prerender). */
export function prerenderPaths(): string[] {
  return allRoutes().map((route) => route.path);
}

/** Canonical, indexable paths (used for the sitemap). */
export function sitemapPaths(): string[] {
  return allRoutes()
    .filter((route) => !route.noindex)
    .map((route) => route.path);
}

/** sitemap.xml covering exactly the indexable routes. */
export function sitemapXml(): string {
  const origin = siteOrigin();
  const entries = sitemapPaths().map((path) => {
    const guide =
      path.startsWith('/guides/') && path !== '/guides/'
        ? GUIDE_META.find((g) => guidePath(g.slug) === path)
        : undefined;
    const lastmod = guide ? guide.reviewedAt : '2026-10-12';
    return `  <url>\n    <loc>${origin}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;
}
