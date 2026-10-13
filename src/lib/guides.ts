/** Guide metadata + raw Markdown. Single source for /guides/ pages, routes and sitemap. */

export interface GuideMeta {
  slug: string;
  title: string;
  description: string;
  /** Publication date (ISO). */
  publishedAt: string;
  /** Last review date shown on the article (ISO). */
  reviewedAt: string;
  /** Related tool paths for cross-linking. */
  relatedTools: string[];
  tags: string[];
}

export const GUIDE_META: GuideMeta[] = [
  {
    slug: 'compress-image-for-email',
    title: 'How to Compress an Image for Email',
    description:
      'Shrink a photo so it attaches cleanly to an email: what mail providers actually limit, which format to pick, and how small is small enough.',
    publishedAt: '2026-10-12',
    reviewedAt: '2026-10-12',
    relatedTools: ['/image-compressor/', '/image-resizer/'],
    tags: ['email', 'compression', 'jpg', 'webp'],
  },
  {
    slug: 'resize-image-without-stretching',
    title: 'How to Resize an Image Without Stretching It',
    description:
      'Why images stretch, how aspect ratio works, and the exact steps to change dimensions while keeping proportions intact.',
    publishedAt: '2026-10-12',
    reviewedAt: '2026-10-12',
    relatedTools: ['/image-resizer/', '/social-image-sizes/'],
    tags: ['resize', 'aspect ratio', 'dimensions'],
  },
  {
    slug: 'jpeg-vs-png-vs-webp',
    title: 'JPEG vs PNG vs WebP: Differences and Use Cases',
    description:
      'A practical comparison of the three formats you meet online: compression type, transparency, quality loss and where each one wins.',
    publishedAt: '2026-10-12',
    reviewedAt: '2026-10-12',
    relatedTools: ['/image-converter/', '/image-compressor/'],
    tags: ['jpeg', 'png', 'webp', 'formats'],
  },
  {
    slug: 'image-compression-quality',
    title: 'How Image Compression Affects Quality',
    description:
      'What a quality slider actually does, the difference between lossy and lossless, and how to find the point where smaller files stop looking worse.',
    publishedAt: '2026-10-12',
    reviewedAt: '2026-10-12',
    relatedTools: ['/image-compressor/'],
    tags: ['quality', 'lossy', 'lossless', 'compression'],
  },
  {
    slug: 'social-media-image-dimensions',
    title: 'How to Choose Image Dimensions for Social Media',
    description:
      'How to read platform specs, why safe areas and aspect ratios matter, and how to resize one master image for every network.',
    publishedAt: '2026-10-12',
    reviewedAt: '2026-10-12',
    relatedTools: ['/social-image-sizes/', '/image-resizer/'],
    tags: ['social media', 'dimensions', 'aspect ratio'],
  },
];

export function guidePath(slug: string): string {
  return `/guides/${slug}/`;
}

export function findGuide(slug: string): GuideMeta | undefined {
  return GUIDE_META.find((guide) => guide.slug === slug);
}

/**
 * Raw Markdown bodies, loaded at build time by Vite (and by Vitest).
 * Keys are guide slugs.
 */
const modules = import.meta.glob('../content/guides/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export function guideMarkdown(slug: string): string {
  const key = `../content/guides/${slug}.md`;
  const body = modules[key];
  if (!body) {
    throw new Error(`Missing markdown body for guide "${slug}" (expected ${key})`);
  }
  // Frontmatter is build metadata only — never render it into the article.
  return parseFrontmatter(body).body;
}

/** Split `key: value` frontmatter from the Markdown body. */
export function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, body: raw.slice(match[0].length) };
}
