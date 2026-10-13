import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface Crumb {
  label: string;
  /** Canonical path; omit for the current page. */
  to?: string;
}

/**
 * Visible breadcrumb trail plus matching BreadcrumbList JSON-LD
 * (structured data mirrors exactly what is shown).
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <li className="flex items-center gap-1.5">
            <Link to="/" className="inline-flex items-center gap-1 hover:text-brand">
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Home</span>
            </Link>
          </li>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                {item.to && !isLast ? (
                  <Link to={item.to} className="hover:text-brand">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className="font-medium text-ink-soft">
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
      </ol>
    </nav>
  );
}
