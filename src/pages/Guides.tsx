import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import { GUIDE_META, guidePath } from '../lib/guides';

/** /guides/ — index of every published guide. */
export function Guides() {
  return (
    <PageShell
      crumbs={[{ label: 'Guides and Tutorials' }]}
      title="Guides and Tutorials"
      intro="Original, practical guides that answer real questions about images and content — each one written for a specific task and linked to the working tool that does it."
      wide
    >
      <ul className="grid gap-4 sm:grid-cols-2">
        {GUIDE_META.map((guide) => (
          <li key={guide.slug}>
            <Link
              to={guidePath(guide.slug)}
              className="card flex h-full flex-col gap-2.5 p-5 hover:border-brand/40"
            >
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-brand">
                <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                Guide
              </span>
              <span className="text-lg font-semibold leading-6 text-ink">{guide.title}</span>
              <span className="text-sm leading-6 text-muted">{guide.description}</span>
              <span className="mt-auto flex flex-wrap gap-1.5 pt-3">
                {guide.tags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </span>
              <span className="text-xs text-muted">Last reviewed {guide.reviewedAt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
