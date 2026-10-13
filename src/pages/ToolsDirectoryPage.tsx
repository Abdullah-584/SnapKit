import { PageShell } from '../components/PageShell';
import { ToolSearch } from '../components/ToolSearch';
import { TOOLS, CATEGORY_META } from '../lib/tools';

/** /tools/ — the full, searchable directory of working tools. */
export function ToolsDirectoryPage() {
  return (
    <PageShell
      crumbs={[{ label: 'All Tools' }]}
      title="All Tools"
      intro="Every free tool on SnapKit in one place. Search by name or purpose, or scroll the full list — each card opens a working tool."
      wide
    >
      <ToolSearch id="directory-search" showAllWhenEmpty />

      <section aria-labelledby="by-category" className="pt-4">
        <h2 id="by-category" className="text-lg font-bold text-ink">
          Browse by category
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map((key) => (
            <li key={key}>
              <a href={CATEGORY_META[key].path} className="chip hover:border-brand hover:text-brand">
                {CATEGORY_META[key].name} ({TOOLS.filter((tool) => tool.category === key).length})
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
