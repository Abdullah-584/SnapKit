/** Central registry of every tool. Drives cards, search, category pages and routes. */

export type ToolCategory = 'image' | 'text' | 'guides';

export interface ToolMeta {
  id: string;
  name: string;
  /** Canonical path with trailing slash. */
  path: string;
  category: ToolCategory;
  /** One-line description used on cards and in search. */
  summary: string;
  /** Search keywords (name, synonyms, use cases). */
  keywords: string[];
  /** Icon key resolved by <ToolIcon />. */
  icon: string;
  /** Shown as a featured tool on the homepage. */
  featured?: boolean;
  seo: { title: string; description: string };
}

export const CATEGORY_META: Record<
  ToolCategory,
  { name: string; path: string; blurb: string }
> = {
  image: {
    name: 'Image Tools',
    path: '/image-tools/',
    blurb: 'Compress, resize and convert images locally in your browser.',
  },
  text: {
    name: 'Text Tools',
    path: '/text-tools/',
    blurb: 'Count words, characters, sentences and reading time.',
  },
  guides: {
    name: 'Guides and Tutorials',
    path: '/guides/',
    blurb: 'Step-by-step answers to common image and content tasks.',
  },
};

export const TOOLS: ToolMeta[] = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    path: '/image-compressor/',
    category: 'image',
    summary: 'Reduce JPG, PNG and WebP file size in your browser with a quality slider.',
    keywords: [
      'compress image',
      'image compressor',
      'reduce file size',
      'shrink photo',
      'optimize jpg',
      'compress png',
      'webp compression',
      'email attachment size',
    ],
    icon: 'Minimize2',
    featured: true,
    seo: {
      title: 'Image Compressor — Shrink JPG, PNG & WebP in Your Browser | SnapKit',
      description:
        'Compress JPG, PNG and WebP images locally in your browser. Choose quality and output format, see the real size reduction, and download the result. Files never leave your device.',
    },
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    path: '/image-resizer/',
    category: 'image',
    summary: 'Resize photos by pixels or percentage with aspect-ratio lock.',
    keywords: [
      'resize image',
      'image resizer',
      'change dimensions',
      'scale photo',
      'resize to width',
      'percentage resize',
      'pixel dimensions',
    ],
    icon: 'Scaling',
    featured: true,
    seo: {
      title: 'Image Resizer — Resize Photos by Pixels or Percentage | SnapKit',
      description:
        'Resize images online for free: set exact pixel dimensions or scale by percentage, lock the aspect ratio, preview the result and download. Processing happens in your browser.',
    },
  },
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    path: '/image-converter/',
    category: 'image',
    summary: 'Convert between JPEG, PNG and WebP with transparency warnings.',
    keywords: [
      'convert image',
      'image converter',
      'png to jpg',
      'jpg to webp',
      'webp to png',
      'change file format',
      'format conversion',
    ],
    icon: 'RefreshCw',
    featured: true,
    seo: {
      title: 'Image Format Converter — JPEG, PNG & WebP | SnapKit',
      description:
        'Convert images between JPEG, PNG and WebP directly in your browser. Transparency is preserved where the format supports it, and unsupported encoders are detected instead of producing broken files.',
    },
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    path: '/word-counter/',
    category: 'text',
    summary: 'Live word, character, sentence and paragraph counts with reading time.',
    keywords: [
      'word counter',
      'character counter',
      'text counter',
      'sentence counter',
      'paragraph count',
      'reading time',
      'essay word count',
    ],
    icon: 'Type',
    featured: true,
    seo: {
      title: 'Word Counter — Words, Characters & Reading Time | SnapKit',
      description:
        'Count words, characters with and without spaces, sentences, paragraphs and reading time as you type. Clear counting rules, sample text and one-click copy. Text stays on your device.',
    },
  },
  {
    id: 'social-image-sizes',
    name: 'Social Image Size Guide',
    path: '/social-image-sizes/',
    category: 'guides',
    summary: 'Verified image dimensions for major social platforms, with resize shortcuts.',
    keywords: [
      'social media image sizes',
      'instagram size',
      'facebook cover size',
      'linkedin banner size',
      'youtube thumbnail size',
      'twitter header size',
      'profile picture size',
      'aspect ratio',
    ],
    icon: 'Ruler',
    featured: true,
    seo: {
      title: 'Social Media Image Sizes (2026) — Platform Dimensions Guide | SnapKit',
      description:
        'Searchable directory of current social media image sizes for Facebook, Instagram, X, LinkedIn, YouTube, Pinterest and TikTok, with aspect ratios, source links and a one-click resize shortcut.',
    },
  },
];

export function toolsInCategory(category: ToolCategory): ToolMeta[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function featuredTools(): ToolMeta[] {
  return TOOLS.filter((tool) => tool.featured);
}

/** Case-insensitive search over name, summary and keywords. */
export function searchTools(query: string, tools: ToolMeta[] = TOOLS): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);
  return tools.filter((tool) => {
    const haystack = [tool.name, tool.summary, CATEGORY_META[tool.category].name, ...tool.keywords]
      .join(' ')
      .toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
