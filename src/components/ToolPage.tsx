import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Info, Lock, TriangleAlert } from 'lucide-react';
import { Breadcrumbs, type Crumb } from './Breadcrumbs';
import { PageSeo } from './SEO';
import { RelatedTools } from './RelatedTools';
import { GUIDE_META, guidePath } from '../lib/guides';
import { breadcrumbTrailJsonLd } from '../lib/seo';
import type { ToolMeta } from '../lib/tools';

export interface FaqItem {
  question: string;
  answer: string;
}

interface ToolPageShellProps {
  /** Trail after Home; the last item is the current page (no `to`). */
  crumbs: Crumb[];
  title: string;
  /** Short intro shown under the H1, above the tool. */
  intro: string;
  children: ReactNode;
  /** Extra JSON-LD (e.g. FAQ) merged with the breadcrumb block. */
  jsonLd?: unknown[];
  relatedPicks?: ToolMeta[];
}

/**
 * Standard structure for every tool page:
 * breadcrumbs → H1 → intro → working tool + content sections → related tools → guides.
 */
export function ToolPageShell({ crumbs, title, intro, children, jsonLd, relatedPicks }: ToolPageShellProps) {
  const location = useLocation();
  const breadcrumbLd = breadcrumbTrailJsonLd(
    location.pathname,
    crumbs.map((crumb) => ({ name: crumb.label, path: crumb.to })),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-4 pt-8 sm:px-6">
      <PageSeo jsonLd={[breadcrumbLd, ...(jsonLd ?? [])]} />
      <Breadcrumbs items={crumbs} />
      <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-ink sm:text-4xl">{title}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-soft">{intro}</p>
      <div className="mt-8 space-y-10">{children}</div>
      <div className="mt-12 space-y-8">
        <RelatedTools currentPath={location.pathname} picks={relatedPicks} />
        <LearningResources currentPath={location.pathname} />
      </div>
    </div>
  );
}

/** Links to guides that reference the current tool (or the latest guides otherwise). */
export function LearningResources({ currentPath }: { currentPath: string }) {
  const related = GUIDE_META.filter((guide) => guide.relatedTools.includes(currentPath));
  const guides = (related.length > 0 ? related : GUIDE_META).slice(0, 3);
  if (guides.length === 0) return null;

  return (
    <section aria-labelledby="learn-heading" className="rounded-card border border-line bg-brand-soft/60 p-6">
      <h2 id="learn-heading" className="flex items-center gap-2 text-lg font-bold text-ink">
        <BookOpen className="h-5 w-5 text-brand" aria-hidden="true" />
        Keep learning
      </h2>
      <ul className="mt-3 space-y-2">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              to={guidePath(guide.slug)}
              className="font-medium text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
            >
              {guide.title}
            </Link>
            <span className="text-sm text-muted"> — {guide.description}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted">
        <Link to="/guides/" className="font-medium text-brand underline">
          All guides
        </Link>
      </p>
    </section>
  );
}

/** Numbered step-by-step instructions. */
export function StepsSection({ title = 'How to use this tool', steps }: { title?: string; steps: string[] }) {
  return (
    <section aria-labelledby="steps-heading">
      <h2 id="steps-heading" className="text-xl font-bold text-ink">
        {title}
      </h2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-[0.975rem] leading-7 text-ink-soft">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white"
            >
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const TONE_STYLES = {
  info: { className: 'border-brand/25 bg-brand-soft', icon: Info, iconClass: 'text-brand', title: 'Good to know' },
  warning: { className: 'border-warning/30 bg-warning-soft', icon: TriangleAlert, iconClass: 'text-warning', title: 'Heads up' },
  privacy: { className: 'border-success/25 bg-success-soft', icon: Lock, iconClass: 'text-success', title: 'Privacy' },
} as const;

/** Inline note box (info / warning / privacy). */
export function NoteBox({
  tone,
  title,
  children,
}: {
  tone: keyof typeof TONE_STYLES;
  title?: string;
  children: ReactNode;
}) {
  const style = TONE_STYLES[tone];
  const Icon = style.icon;
  return (
    <div className={`rounded-card border px-4 py-3.5 ${style.className}`}>
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Icon className={`h-4 w-4 ${style.iconClass}`} aria-hidden="true" />
        {title ?? style.title}
      </p>
      <div className="mt-1.5 text-sm leading-6 text-ink-soft">{children}</div>
    </div>
  );
}

/** FAQ accordion (native <details>, keyboard accessible without JS). */
export function FaqSection({ items }: { items: FaqItem[] }) {
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl font-bold text-ink">
        Frequently asked questions
      </h2>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-card border border-line">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-[0.975rem] font-semibold text-ink marker:hidden focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-3">
                {item.question}
                <span aria-hidden="true" className="mt-0.5 text-brand transition-transform group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2.5 text-sm leading-6 text-ink-soft">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/** Two-column content block used for formats / limitations / privacy sections. */
export function ContentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-xl font-bold text-ink">
        {title}
      </h2>
      <div className="mt-3 max-w-3xl text-[0.975rem] leading-7 text-ink-soft">{children}</div>
    </section>
  );
}
