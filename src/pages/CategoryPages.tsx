import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { ToolCard } from '../components/ToolCard';
import { NoteBox } from '../components/ToolPage';
import { CATEGORY_META, toolsInCategory, type ToolCategory } from '../lib/tools';
import { GUIDE_META, guidePath } from '../lib/guides';

function CategoryPage({ category }: { category: ToolCategory }) {
  const meta = CATEGORY_META[category];
  const tools = toolsInCategory(category);
  const relatedGuides = GUIDE_META.filter((guide) =>
    tools.some((tool) => guide.relatedTools.includes(tool.path)),
  ).slice(0, 3);

  return (
    <PageShell crumbs={[{ label: meta.name }]} title={meta.name} intro={meta.blurb} wide>
      <section aria-label={`${meta.name} list`}>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      {category === 'image' && (
        <NoteBox tone="privacy">
          All image tools here process files locally in your browser — they never upload your
          pictures. Check each tool page for supported formats and limits.
        </NoteBox>
      )}

      {category === 'text' && (
        <NoteBox tone="info" title="More text tools are planned">
          The Word Counter is SnapKit's first text tool. The Guides section covers related
          writing-and-image tasks while more text utilities are built.
        </NoteBox>
      )}

      {relatedGuides.length > 0 && (
        <section aria-labelledby="related-guides" className="pt-2">
          <h2 id="related-guides" className="text-lg font-bold text-ink">
            Guides for these tools
          </h2>
          <ul className="mt-3 space-y-2">
            {relatedGuides.map((guide) => (
              <li key={guide.slug}>
                <Link to={guidePath(guide.slug)} className="font-medium text-brand hover:underline">
                  {guide.title}
                </Link>
                <span className="text-sm text-muted"> — {guide.description}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  );
}

export function ImageToolsPage() {
  return <CategoryPage category="image" />;
}

export function TextToolsPage() {
  return <CategoryPage category="text" />;
}
