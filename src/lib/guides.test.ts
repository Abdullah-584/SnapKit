import { describe, expect, it } from 'vitest';
import { GUIDE_META, guideMarkdown, parseFrontmatter } from './guides';
import { renderMarkdown } from './markdown';

describe('guides', () => {
  it.each(GUIDE_META.map((g) => [g.slug, g.slug] as const))(
    'strips YAML frontmatter from the body of "%s"',
    (_slug, slug) => {
      const body = guideMarkdown(slug);
      // no frontmatter fence or key: value metadata may survive into the body
      expect(body.startsWith('---')).toBe(false);
      expect(body).not.toMatch(/^title:/m);
      expect(body).not.toMatch(/^date:/m);
    },
  );

  it('renders guide HTML without frontmatter artifacts', () => {
    for (const guide of GUIDE_META) {
      const html = renderMarkdown(guideMarkdown(guide.slug));
      expect(html).not.toContain('title:');
      expect(html).not.toContain('<hr');
    }
  });

  it('parseFrontmatter keeps the body after the closing fence', () => {
    const { data, body } = parseFrontmatter('---\ntitle: Test\n---\n\n# Hello\n');
    expect(data.title).toBe('Test');
    expect(body.trim().startsWith('# Hello')).toBe(true);
  });

  it('parseFrontmatter passes through text without a fence', () => {
    const { data, body } = parseFrontmatter('# Just markdown\n');
    expect(data).toEqual({});
    expect(body).toBe('# Just markdown\n');
  });
});
