import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Scaling, SearchX } from 'lucide-react';
import {
  SOCIAL_GROUPS,
  SOCIAL_PLATFORMS,
  SOCIAL_SPECS,
  SPEC_VERIFIED_ON,
  STATUS_LABELS,
  searchSocialSpecs,
  type SpecStatus,
} from '../lib/socialImageSizes';
import { ContentSection, FaqSection, NoteBox, ToolPageShell } from '../components/ToolPage';
import { faqJsonLd } from '../lib/seo';

const FAQ = [
  {
    question: 'Are these sizes official recommendations?',
    answer:
      'Mixed — and the table says so per row. “Official” rows come from the platform\'s own help pages, “Official (ad specs)” rows come from the platform\'s advertising documentation, and “Convention” rows are sizes practitioners use because the platform publishes no exact pixels for that placement. Each row links to its source.',
  },
  {
    question: 'When were these specifications verified?',
    answer: `Every row was checked against the linked source on ${SPEC_VERIFIED_ON}. Platforms change layouts often, so check the source link if a placement looks different in the app.`,
  },
  {
    question: 'What is an aspect ratio and why does it matter?',
    answer:
      'The aspect ratio is width ÷ height (for example 1080 × 1350 is 4:5). Apps crop toward the ratio they display, so an image with the right ratio keeps its composition instead of losing the top and bottom — or the sides — to automatic cropping.',
  },
  {
    question: 'How do I use the Resize button?',
    answer:
      'Each row links to the Image Resizer with that placement\'s width and height prefilled. Choose your file, confirm the preset, and download the correctly sized image.',
  },
  {
    question: 'What file size and quality should I upload?',
    answer:
      'Upload the largest sensible file in the target dimensions and let the platform downscale. Avoid resizing an already-compressed image repeatedly — every re-encode softens detail. Where the platform publishes a maximum file size, the table shows it.',
  },
];

const STATUS_STYLES: Record<SpecStatus, string> = {
  official: 'border-success/30 bg-success-soft text-success',
  'ad-spec': 'border-brand/30 bg-brand-soft text-brand-dark',
  convention: 'border-warning/40 bg-warning-soft text-warning',
};

export function SocialImageSizesPage() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('All platforms');
  const [group, setGroup] = useState('All types');

  const results = useMemo(
    () => searchSocialSpecs(SOCIAL_SPECS, query, platform, group),
    [query, platform, group],
  );
  const isFiltering = query.trim() !== '' || platform !== 'All platforms' || group !== 'All types';

  return (
    <ToolPageShell
      crumbs={[{ label: 'Guides and Tutorials', to: '/guides/' }, { label: 'Social Image Size Guide' }]}
      title="Social Image Size Guide"
      intro="Searchable, source-linked image dimensions for Facebook, Instagram, X, LinkedIn, YouTube, Pinterest and TikTok — with aspect ratios, verification dates and a one-click resize shortcut for every entry."
      jsonLd={[faqJsonLd(FAQ)]}
    >
      <section aria-label="Social image size directory" className="card p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
          <div>
            <label htmlFor="spec-search" className="label">
              Search placements
            </label>
            <input
              id="spec-search"
              type="search"
              className="input mt-1.5"
              placeholder="e.g. banner, profile, 1080…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="spec-platform" className="label">
              Platform
            </label>
            <select
              id="spec-platform"
              className="input mt-1.5"
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
            >
              <option>All platforms</option>
              {SOCIAL_PLATFORMS.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="spec-group" className="label">
              Image type
            </label>
            <select
              id="spec-group"
              className="input mt-1.5"
              value={group}
              onChange={(event) => setGroup(event.target.value)}
            >
              <option>All types</option>
              {SOCIAL_GROUPS.map((name) => (
                <option key={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>

        <p role="status" aria-live="polite" className="mt-3 text-sm text-muted">
          {isFiltering
            ? `${results.length} of ${SOCIAL_SPECS.length} placements match.`
            : `Showing all ${SOCIAL_SPECS.length} placements.`}{' '}
          <span>Specs last verified {SPEC_VERIFIED_ON}.</span>
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-card border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
            <SearchX className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold text-ink">No placements match</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted">
              Nothing matches the current search and filters. Reset them to see every platform and
              placement.
            </p>
            <button
              type="button"
              className="btn-secondary mt-4"
              onClick={() => {
                setQuery('');
                setPlatform('All platforms');
                setGroup('All types');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-sm">
              <caption className="sr-only">
                Image dimensions by platform and placement, with sources
              </caption>
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th scope="col" className="py-2 pr-3 font-semibold">Platform</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Placement</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Size (px)</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Ratio</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Source</th>
                  <th scope="col" className="py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map((spec) => (
                  <tr key={spec.id} className="border-b border-line align-top last:border-b-0">
                    <th scope="row" className="py-3 pr-3 text-left font-semibold text-ink">
                      {spec.platform}
                      <span className="mt-0.5 block text-xs font-normal text-muted">{spec.group}</span>
                    </th>
                    <td className="py-3 pr-3 text-ink-soft">
                      {spec.placement}
                      <span className="mt-1 block max-w-xs text-xs text-muted">{spec.note}</span>
                      {spec.formats && (
                        <span className="mt-1 block text-xs text-muted">Formats: {spec.formats}</span>
                      )}
                      {spec.maxSize && (
                        <span className="mt-0.5 block text-xs text-muted">Limit: {spec.maxSize}</span>
                      )}
                    </td>
                    <td className="py-3 pr-3 font-mono text-xs font-semibold text-ink">
                      {spec.width} × {spec.height}
                    </td>
                    <td className="py-3 pr-3 text-ink-soft">{spec.ratio}</td>
                    <td className="py-3 pr-3">
                      <span className={`chip ${STATUS_STYLES[spec.status]}`} title={STATUS_LABELS[spec.status]}>
                        {spec.status === 'official' ? 'Official' : spec.status === 'ad-spec' ? 'Official (ads)' : 'Convention'}
                      </span>
                      <a
                        href={spec.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-brand underline"
                      >
                        {spec.sourceLabel}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </a>
                    </td>
                    <td className="py-3">
                      <Link
                        to={`/image-resizer/?width=${spec.width}&height=${spec.height}`}
                        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-brand/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-brand hover:bg-brand-soft"
                      >
                        <Scaling className="h-3.5 w-3.5" aria-hidden="true" />
                        Resize to {spec.width}×{spec.height}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ContentSection id="status-heading" title="How to read the status labels">
        <ul>
          <li>
            <strong>Official</strong> — the platform documents this size in its own help centre.
          </li>
          <li>
            <strong>Official (ads)</strong> — published by the platform, but in advertising
            specifications rather than organic-post docs.
          </li>
          <li>
            <strong>Convention</strong> — widely used practice where the platform publishes no
            exact pixels; treat it as a safe default, not a guarantee.
          </li>
        </ul>
        <p>
          Nothing here implies endorsement by any platform. Every number was fetched from the
          linked source on {SPEC_VERIFIED_ON} — open the source to see it yourself.
        </p>
      </ContentSection>

      <ContentSection id="ratio-heading" title="Aspect ratio, cropping and quality">
        <p>
          <strong>Aspect ratio</strong> is width divided by height. 1080 × 1350 is 4:5, 1500 × 500
          is 3:1. Apps display and crop toward their own preferred ratio, so matching it keeps your
          composition intact.
        </p>
        <p>
          <strong>Cropping</strong> happens automatically: profile pictures become circles, covers
          are trimmed differently on desktop and mobile, and feeds crop wide images. Keep text and
          logos inside the safe middle of a banner.
        </p>
        <p>
          <strong>Quality</strong> — export at the target size from your original, not by
          upscaling a small file. Upload PNG for text-heavy graphics (lossless) and JPEG/WebP for
          photographs.
        </p>
      </ContentSection>

      <NoteBox tone="privacy">
        This guide is a reference page: searching and filtering it happens locally, and the Resize
        action simply opens the Image Resizer with the row's dimensions — your image still never
        leaves your browser.
      </NoteBox>

      <FaqSection items={FAQ} />
    </ToolPageShell>
  );
}
