import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { PageSeo } from './SEO';
import { breadcrumbTrailJsonLd } from '../lib/seo';

interface PageShellProps {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  children: ReactNode;
  jsonLd?: unknown[];
  /** Wider content column (tool directories). */
  wide?: boolean;
}

/** Consistent shell for informational and directory pages. */
export function PageShell({ crumbs, title, intro, children, jsonLd, wide = false }: PageShellProps) {
  const location = useLocation();
  const breadcrumbLd = breadcrumbTrailJsonLd(
    location.pathname,
    crumbs.map((crumb) => ({ name: crumb.label, path: crumb.to })),
  );

  return (
    <div className={`mx-auto w-full px-4 pb-4 pt-8 sm:px-6 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}>
      <PageSeo jsonLd={[breadcrumbLd, ...(jsonLd ?? [])]} />
      <Breadcrumbs items={crumbs} />
      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {intro && <p className="mt-4 text-lg leading-8 text-ink-soft">{intro}</p>}
      <div className="mt-8 space-y-8">{children}</div>
    </div>
  );
}
