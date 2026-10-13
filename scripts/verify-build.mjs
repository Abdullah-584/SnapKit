/**
 * Post-build verification. Fails the build when the shipped artifacts do not
 * meet the SEO/functional acceptance criteria.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');

const ORIGIN = process.env.VITE_SITE_URL || 'https://snapkit.42web.io';

const failures = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

async function readIfExists(relPath) {
  try {
    return await fs.readFile(path.join(distDir, relPath), 'utf8');
  } catch {
    return null;
  }
}

const EXPECTED_ROUTES = [
  '/',
  '/tools/',
  '/image-tools/',
  '/text-tools/',
  '/guides/',
  '/image-compressor/',
  '/image-resizer/',
  '/image-converter/',
  '/word-counter/',
  '/social-image-sizes/',
  '/guides/compress-image-for-email/',
  '/guides/resize-image-without-stretching/',
  '/guides/jpeg-vs-png-vs-webp/',
  '/guides/image-compression-quality/',
  '/guides/social-media-image-dimensions/',
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms-of-use/',
  '/cookie-preferences/',
];

async function main() {
  const indexHtml = await readIfExists('index.html');
  check(Boolean(indexHtml), 'dist/index.html missing');

  const titles = new Map();

  for (const route of EXPECTED_ROUTES) {
    const rel = route === '/' ? 'index.html' : `${route.replace(/^\//, '')}index.html`;
    const html = await readIfExists(rel);
    check(Boolean(html), `missing prerendered page: ${rel}`);
    if (!html) continue;

    const title = /<title>([^<]*)<\/title>/.exec(html)?.[1]?.trim();
    check(Boolean(title), `${route}: missing <title>`);
    if (title) {
      check(!titles.has(title), `${route}: duplicate <title> with ${titles.get(title)}`);
      titles.set(title, route);
    }

    const expectedCanonical = `${ORIGIN}${route}`;
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    check(canonical === expectedCanonical, `${route}: canonical is "${canonical}", expected "${expectedCanonical}"`);

    check(/<meta name="description" content="[^"]{40,}"/.test(html), `${route}: missing meta description`);
    check(/property="og:title"/.test(html), `${route}: missing og:title`);
    check(/<h1[\s>]/.test(html), `${route}: no <h1> in prerendered HTML`);
  }

  // sitemap: canonical URLs, unique, no query strings.
  const sitemap = await readIfExists('sitemap.xml');
  check(Boolean(sitemap), 'sitemap.xml missing');
  if (sitemap) {
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    check(locs.length === EXPECTED_ROUTES.length, `sitemap has ${locs.length} URLs, expected ${EXPECTED_ROUTES.length}`);
    check(new Set(locs).size === locs.length, 'sitemap contains duplicate URLs');
    for (const loc of locs) {
      check(!loc.includes('?'), `sitemap URL contains a query string: ${loc}`);
      check(loc.startsWith(ORIGIN), `sitemap URL off-origin: ${loc}`);
    }
    for (const route of EXPECTED_ROUTES) {
      check(locs.includes(`${ORIGIN}${route}`), `sitemap missing ${route}`);
    }
  }

  // robots.txt must not block important resources.
  const robots = await readIfExists('robots.txt');
  check(Boolean(robots), 'robots.txt missing');
  if (robots) {
    check(!/^Disallow:\s*\/$/m.test(robots), 'robots.txt disallows everything');
    check(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`), 'robots.txt missing sitemap reference');
  }

  // Custom 404: exists, noindex, and not a bare shell.
  const notFound = await readIfExists('404.html');
  check(Boolean(notFound), '404.html missing');
  if (notFound) {
    check(/noindex/.test(notFound), '404.html missing noindex');
    check(/<h1[\s>]/.test(notFound), '404.html has no visible content');
  }

  // SPA deep-link support for hosts without per-route directories.
  const htaccess = await readIfExists('.htaccess');
  check(Boolean(htaccess), '.htaccess missing');

  // Referenced build assets must exist (no broken <script>/<link> to /assets/).
  if (indexHtml) {
    const assets = [...indexHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
    check(assets.length > 0, 'index.html references no /assets/ bundles');
    for (const asset of new Set(assets)) {
      const file = path.join(distDir, asset.replace(/^\//, ''));
      try {
        await fs.access(file);
      } catch {
        check(false, `missing build asset: ${asset}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error('verify-build FAILED:');
    for (const failure of failures) console.error(`  ✗ ${failure}`);
    process.exit(1);
  }
  console.log(`verify-build OK: ${EXPECTED_ROUTES.length} routes, unique titles, canonical URLs, sitemap, robots, 404`);
}

main().catch((error) => {
  console.error('verify-build crashed:', error);
  process.exit(1);
});
