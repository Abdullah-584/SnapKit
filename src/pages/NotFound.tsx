import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { PageSeo } from '../components/SEO';
import { TOOLS } from '../lib/tools';

/** Custom 404 page. Also emitted as a static 404.html by the build. */
export function NotFound() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-8 pt-14 text-center sm:px-6">
      <PageSeo
        title="Page Not Found | SnapKit"
        description="This page does not exist. Browse the free tools and guides on SnapKit."
        noindex
      />
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">Error 404</p>
      <Compass className="mx-auto mt-6 h-14 w-14 text-brand" aria-hidden="true" />
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        We could not find that page
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-ink-soft">
        The link may be outdated, or the address may have a typo. Nothing was lost — every tool
        still works from the pages below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Go to Home
        </Link>
        <Link to="/tools/" className="btn-secondary">
          Browse All Tools
        </Link>
        <Link to="/guides/" className="btn-secondary">
          Read the Guides
        </Link>
      </div>
      <ul className="mx-auto mt-10 grid max-w-2xl gap-2 text-left sm:grid-cols-2">
        {TOOLS.slice(0, 4).map((tool) => (
          <li key={tool.id}>
            <Link
              to={tool.path}
              className="block rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink hover:border-brand hover:text-brand"
            >
              {tool.name} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
