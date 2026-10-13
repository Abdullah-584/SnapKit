/**
 * Prerender step (runs after `vite build` and the SSR build).
 *
 * Renders every canonical route into its own directory so that:
 *  - crawlers receive complete HTML with correct metadata without JavaScript
 *  - every route is a REAL file/directory on static hosts (InfinityFree),
 *    which means real 200s, a real 404 status for missing URLs, and correct
 *    canonical/trailing-slash behavior with no rewrite tricks.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const ssrDir = path.join(root, '.prerender');

async function findEntry(dir) {
  const entries = await fs.readdir(dir);
  const entry = entries.find((name) => name.endsWith('.js'));
  if (!entry) throw new Error(`No SSR entry found in ${dir}`);
  return path.join(dir, entry);
}

/** Inject route metadata + rendered HTML into the dist HTML shell. */
function injectTemplate(template, { path: routePath, head, html }) {
  let out = template;
  // Keep exactly one <title> and one description (the injected ones).
  out = out.replace(/<title>[\s\S]*?<\/title>/, '');
  out = out.replace(/<meta name="description"[^>]*>\s*/i, '');
  // Record which route this snapshot came from (client uses it to choose
  // hydration vs full re-render).
  out = out.replace(
    '<html lang="en" data-prerender-path="">',
    `<html lang="en" data-prerender-path="${routePath}">`,
  );
  out = out.replace('</head>', `  ${head}\n  </head>`);
  out = out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  return out;
}

async function main() {
  const template = await fs.readFile(path.join(distDir, 'index.html'), 'utf8');
  const entryPath = await findEntry(ssrDir);
  const { render, prerenderPaths, sitemapXml } = await import(pathToFileURL(entryPath).href);

  // 1. Prerender every canonical route.
  for (const route of prerenderPaths()) {
    const page = render(route);
    if (page.status !== 200) throw new Error(`Prerender expected 200 for ${route}, got ${page.status}`);
    const target =
      route === '/' ? path.join(distDir, 'index.html') : path.join(distDir, route, 'index.html');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, injectTemplate(template, page), 'utf8');
  }

  // 2. Custom error page (served via ErrorDocument 404 /404.html in .htaccess).
  const notFound = render('/__404__/');
  await fs.writeFile(
    path.join(distDir, '404.html'),
    injectTemplate(template, { ...notFound, path: '/__404__/' }),
    'utf8',
  );

  // 3. sitemap.xml with real canonical URLs only.
  await fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml(), 'utf8');

  // 4. Make sure host-level files made it into dist (vite copies public/, but
  //    dotfiles and error pages are worth asserting rather than assuming).
  for (const file of ['.htaccess', 'robots.txt', 'favicon.svg', 'site.webmanifest']) {
    try {
      await fs.access(path.join(distDir, file));
    } catch {
      await fs.copyFile(path.join(root, 'public', file), path.join(distDir, file));
      console.log(`prerender: copied missing ${file} into dist/`);
    }
  }

  console.log(`prerender: wrote ${prerenderPaths().length} routes, 404.html and sitemap.xml`);
}

main().catch((error) => {
  console.error('prerender failed:', error);
  process.exit(1);
});
