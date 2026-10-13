import type { MouseEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageSeo } from '../components/SEO';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { NotFound } from './NotFound';
import { TOOLS } from '../lib/tools';
import { GUIDE_META, findGuide, guideMarkdown, guidePath } from '../lib/guides';
import { renderMarkdown } from '../lib/markdown';
import { breadcrumbTrailJsonLd } from '../lib/seo';

/** /guides/:slug/ — renders a guide from its Markdown source. */
export function GuideArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const guide = slug ? findGuide(slug) : undefined;

  if (!guide) return <NotFound />;

  const html = renderMarkdown(guideMarkdown(guide.slug));
  const related = TOOLS.filter((tool) => guide.relatedTools.includes(tool.path));
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.reviewedAt,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: 'SnapKit' },
    publisher: { '@type': 'Organization', name: 'SnapKit' },
  };
  const breadcrumbLd = breadcrumbTrailJsonLd(`/guides/${guide.slug}/`, [
    { name: 'Guides and Tutorials', path: '/guides/' },
    { name: guide.title },
  ]);

  // Keep in-site navigation inside the SPA even from rendered Markdown links.
  function handleProseClick(event: MouseEvent<HTMLDivElement>) {
    const anchor = (event.target as HTMLElement).closest('a');
    const href = anchor?.getAttribute('href');
    if (!href || !href.startsWith('/') || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    navigate(href);
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-6 pt-8 sm:px-6">
      <PageSeo jsonLd={[breadcrumbLd, articleLd]} type="article" />
      <Breadcrumbs items={[{ label: 'Guides and Tutorials', to: '/guides/' }, { label: guide.title }]} />

      <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{guide.title}</h1>
      <p className="mt-3 text-sm text-muted">
        Last reviewed <time dateTime={guide.reviewedAt}>{guide.reviewedAt}</time> · Originally
        published <time dateTime={guide.publishedAt}>{guide.publishedAt}</time>
      </p>

      <div className="prose-snap mt-8" onClick={handleProseClick}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-tools" className="card mt-10 p-6">
          <h2 id="related-tools" className="text-lg font-bold text-ink">
            Use the tools from this guide
          </h2>
          <ul className="mt-3 space-y-2">
            {related.map((tool) => (
              <li key={tool.id}>
                <Link to={tool.path} className="font-medium text-brand hover:underline">
                  {tool.name}
                </Link>
                <span className="text-sm text-muted"> — {tool.summary}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="More guides" className="mt-8 flex flex-col gap-2 border-t border-line pt-6">
        <span className="text-sm font-semibold text-ink">More guides</span>
        {GUIDE_META.filter((other) => other.slug !== guide.slug)
          .slice(0, 3)
          .map((other) => (
            <Link key={other.slug} to={guidePath(other.slug)} className="text-sm text-brand hover:underline">
              {other.title}
            </Link>
          ))}
      </nav>
    </article>
  );
}
