/**
 * Single source of truth for every indexable URL on the site.
 * Used by the router, the sitemap generator, the prerenderer and the tests.
 */
import { TOOLS, CATEGORY_META } from './tools';
import { GUIDE_META, guidePath } from './guides';
import { normalizePathname } from './seo';

export type RouteCategory = 'image' | 'text' | 'guides' | 'site';
export type RouteKind = 'home' | 'tool' | 'category' | 'guide' | 'page';

export interface SiteRoute {
  /** Canonical path with a trailing slash (root is `/`). */
  path: string;
  title: string;
  description: string;
  category: RouteCategory;
  kind: RouteKind;
  /** Internal/utility pages stay out of the sitemap and carry noindex. */
  noindex?: boolean;
}

const STATIC_ROUTES: SiteRoute[] = [
  {
    path: '/',
    title: 'SnapKit — Free Tools. Quick Results.',
    description:
      'Free online tools for everyday tasks: compress, resize and convert images in your browser, count words, and look up social media image sizes.',
    category: 'site',
    kind: 'home',
  },
  {
    path: '/tools/',
    title: 'All Tools — Every Free Browser Tool on SnapKit | SnapKit',
    description:
      'Browse and search every free tool on SnapKit: image compression, resizing, format conversion, word counting and social media size references.',
    category: 'site',
    kind: 'category',
  },
  {
    path: CATEGORY_META.image.path,
    title: 'Image Tools — Compress, Resize & Convert Images | SnapKit',
    description:
      'Free image tools that run in your browser: compress images, resize photos to exact dimensions, and convert between JPEG, PNG and WebP.',
    category: 'image',
    kind: 'category',
  },
  {
    path: CATEGORY_META.text.path,
    title: 'Text Tools — Word & Character Counting | SnapKit',
    description:
      'Free text tools for writers and students: count words, characters, sentences and paragraphs, and estimate reading time as you type.',
    category: 'text',
    kind: 'category',
  },
  {
    path: '/guides/',
    title: 'Guides and Tutorials — Practical Image & Text How-Tos | SnapKit',
    description:
      'Original step-by-step guides on compressing images for email, resizing without stretching, choosing image formats and social media dimensions.',
    category: 'guides',
    kind: 'category',
  },
  {
    path: '/about/',
    title: 'About Us — Why SnapKit Exists | SnapKit',
    description:
      'SnapKit is a small collection of free browser-based tools for everyday image and text tasks. Learn what we build, who it is for, and how we handle your files.',
    category: 'site',
    kind: 'page',
  },
  {
    path: '/contact/',
    title: 'Contact Us | SnapKit',
    description:
      'Get in touch with SnapKit about bug reports, questions or feedback. Contact details and response expectations, with no hidden forms.',
    category: 'site',
    kind: 'page',
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy | SnapKit',
    description:
      'How SnapKit handles your data: browser-side image and text processing, hosting logs, cookies, advertising, retention and your rights.',
    category: 'site',
    kind: 'page',
  },
  {
    path: '/terms-of-use/',
    title: 'Terms of Use | SnapKit',
    description:
      'The terms that apply when you use SnapKit: permitted use, service limitations, intellectual property, liability and contact details.',
    category: 'site',
    kind: 'page',
  },
  {
    path: '/cookie-preferences/',
    title: 'Cookie and Privacy Preferences | SnapKit',
    description:
      'Review and change your cookie and privacy choices on SnapKit, including the state of any advertising or analytics integrations.',
    category: 'site',
    kind: 'page',
  },
  {
    path: '/process-images/',
    title: 'Redirecting to an image tool | SnapKit',
    description:
      'Internal redirect: a shared image-tool link is forwarded to the matching SnapKit tool.',
    category: 'image',
    kind: 'page',
    noindex: true,
  },
];

function toolRoutes(): SiteRoute[] {
  return TOOLS.map((tool) => ({
    path: tool.path,
    title: tool.seo.title,
    description: tool.seo.description,
    category: tool.category === 'guides' ? 'guides' : tool.category,
    kind: 'tool' as const,
  }));
}

function guideRoutes(): SiteRoute[] {
  return GUIDE_META.map((guide) => ({
    path: guidePath(guide.slug),
    title: `${guide.title} | SnapKit`,
    description: guide.description,
    category: 'guides' as const,
    kind: 'guide' as const,
  }));
}

/** All indexable routes, in a stable order. */
export function allRoutes(): SiteRoute[] {
  return [...STATIC_ROUTES, ...toolRoutes(), ...guideRoutes()];
}

export function findRoute(path: string): SiteRoute | undefined {
  const normalized = normalizePathname(path);
  return allRoutes().find((route) => route.path === normalized);
}
