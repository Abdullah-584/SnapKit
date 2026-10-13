import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { TOOLS, type ToolMeta } from '../lib/tools';

interface RelatedToolsProps {
  currentPath: string;
  /** Optional explicit picks; otherwise same-category tools are used. */
  picks?: ToolMeta[];
  max?: number;
}

/** Cross-links to other working tools (never the current page). */
export function RelatedTools({ currentPath, picks, max = 3 }: RelatedToolsProps) {
  const current = TOOLS.find((tool) => tool.path === currentPath);
  const related =
    picks ??
    [
      ...TOOLS.filter((tool) => tool.path !== currentPath && tool.category === current?.category),
      ...TOOLS.filter((tool) => tool.path !== currentPath && tool.category !== current?.category),
    ].slice(0, max);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="card p-6">
      <h2 id="related-tools-heading" className="text-lg font-bold text-ink">
        Related tools
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {related.slice(0, max).map((tool) => (
          <li key={tool.id}>
            <Link
              to={tool.path}
              className="flex items-start justify-between gap-2 rounded-xl border border-line bg-surface px-4 py-3 hover:border-brand hover:bg-white"
            >
              <span>
                <span className="block text-sm font-semibold text-ink">{tool.name}</span>
                <span className="mt-0.5 block text-xs text-muted">{tool.summary}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
