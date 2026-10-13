import { describe, expect, it } from 'vitest';
import { allRoutes, findRoute } from './routes';
import { GUIDE_META, guidePath } from './guides';
import { TOOLS } from './tools';
import { absoluteUrl, normalizePathname } from './seo';

const EXPECTED_PATHS = [
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
  '/about/',
  '/contact/',
  '/privacy-policy/',
  '/terms-of-use/',
  '/cookie-preferences/',
];

describe('route registry', () => {
  const routes = allRoutes();

  it('contains every expected static path', () => {
    const paths = routes.map((route) => route.path);
    for (const expected of EXPECTED_PATHS) expect(paths).toContain(expected);
  });

  it('contains every tool and guide path', () => {
    const paths = routes.map((route) => route.path);
    for (const tool of TOOLS) expect(paths).toContain(tool.path);
    for (const guide of GUIDE_META) expect(paths).toContain(guidePath(guide.slug));
  });

  it('has unique canonical paths (no duplicates)', () => {
    const paths = routes.map((route) => route.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('has unique titles and descriptions', () => {
    const titles = routes.map((route) => route.title);
    const descriptions = routes.map((route) => route.description);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it('normalizes every path: leading slash, trailing slash, no query', () => {
    for (const route of routes) {
      expect(route.path.startsWith('/')).toBe(true);
      if (route.path !== '/') expect(route.path.endsWith('/')).toBe(true);
      expect(route.path).not.toContain('?');
      expect(route.path).not.toContain('//');
    }
  });

  it('finds routes through slashless and duplicate-slash variants', () => {
    expect(findRoute('/image-compressor')?.path).toBe('/image-compressor/');
    expect(findRoute('/image-compressor/')).toBeDefined();
    expect(findRoute('/image-compressor/?q=1')?.path).toBe('/image-compressor/');
    expect(findRoute('//image-compressor//')).toBeDefined();
    expect(findRoute('/does-not-exist/')).toBeUndefined();
  });
});

describe('SEO URL helpers', () => {
  it('normalizes paths canonically', () => {
    expect(normalizePathname('/tools')).toBe('/tools/');
    expect(normalizePathname('/tools/')).toBe('/tools/');
    expect(normalizePathname('tools')).toBe('/tools/');
    expect(normalizePathname('/')).toBe('/');
    expect(normalizePathname('/tools/?a=b#c')).toBe('/tools/');
  });

  it('builds absolute URLs on the canonical origin', () => {
    expect(absoluteUrl('/word-counter/')).toBe('https://snapkit.42web.io/word-counter/');
    expect(absoluteUrl('https://example.org/x')).toBe('https://example.org/x');
  });
});
