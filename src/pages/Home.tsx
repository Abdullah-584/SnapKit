import { Link } from 'react-router-dom';
import { ArrowRight, FolderSearch, Lightbulb, MousePointerClick, ShieldCheck, SlidersHorizontal, Download } from 'lucide-react';
import { PageSeo } from '../components/SEO';
import { ToolSearch } from '../components/ToolSearch';
import { ToolCard } from '../components/ToolCard';
import { featuredTools, CATEGORY_META, toolsInCategory } from '../lib/tools';
import { GUIDE_META, guidePath } from '../lib/guides';
import { websiteJsonLd } from '../lib/seo';

const STEPS = [
  {
    icon: MousePointerClick,
    title: 'Pick a tool',
    text: 'Search above or browse by category. Every card opens a working tool — no sign-up, no upload queue.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Set your options',
    text: 'Choose quality, dimensions or format. The tool explains what each option changes before you commit.',
  },
  {
    icon: ShieldCheck,
    title: 'Processed locally',
    text: 'Image operations run in this browser tab on your device. Text input stays in the page as you type.',
  },
  {
    icon: Download,
    title: 'Download the result',
    text: 'See the real output size and change, then download or copy. Nothing is stored afterwards.',
  },
];

export function Home() {
  const featured = featuredTools();
  const categories = (Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map((key) => ({
    key,
    ...CATEGORY_META[key],
    count: toolsInCategory(key).length,
  }));

  return (
    <div>
      <PageSeo jsonLd={[websiteJsonLd()]} />

      {/* Hero */}
      <section className="border-b border-line bg-gradient-to-b from-brand-soft/70 to-white">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-14 sm:px-6 sm:pt-20">
          <p className="chip mx-auto w-fit border-brand/25 bg-white text-brand-dark sm:mx-0">
            Free · Runs in your browser · No sign-up
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Free Online Tools for Everyday Tasks
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-soft">
            Compress images, resize photos, convert image formats, and work with text using simple
            tools that run right in your browser.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/tools/" className="btn-primary px-6 py-3 text-base">
              Explore Free Tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/image-tools/" className="btn-secondary px-6 py-3 text-base">
              Browse Image Tools
            </Link>
          </div>
        </div>
      </section>

      {/* Tool search */}
      <section aria-labelledby="search-heading" className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <h2 id="search-heading" className="text-xl font-bold text-ink sm:text-2xl">
          Search tools
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Find a tool by name or by what you want to do — “compress”, “resize”, “word count”.
        </p>
        <div className="mt-4">
          <ToolSearch id="home-search" showAllWhenEmpty />
        </div>
      </section>

      {/* Featured tools */}
      <section aria-labelledby="featured-heading" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id="featured-heading" className="text-xl font-bold text-ink sm:text-2xl">
            Featured tools
          </h2>
          <Link to="/tools/" className="text-sm font-semibold text-brand hover:underline">
            View all tools →
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      </section>

      {/* Categories */}
      <section aria-labelledby="categories-heading" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <h2 id="categories-heading" className="text-xl font-bold text-ink sm:text-2xl">
          Browse by category
        </h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {categories.map((category) => (
            <li key={category.key}>
              <Link
                to={category.path}
                className="card flex h-full flex-col gap-2 p-5 hover:border-brand/40"
              >
                <span className="inline-flex items-center gap-2 text-base font-semibold text-ink">
                  <FolderSearch className="h-5 w-5 text-brand" aria-hidden="true" />
                  {category.name}
                </span>
                <span className="text-sm leading-6 text-muted">{category.blurb}</span>
                <span className="mt-auto pt-2 text-sm font-semibold text-brand">
                  {category.count} {category.count === 1 ? 'tool' : 'tools'} →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-heading" className="mt-14 border-y border-line bg-surface py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="how-heading" className="text-xl font-bold text-ink sm:text-2xl">
            How SnapKit works
          </h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-brand shadow-card"
                >
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    <span className="text-muted">Step {index + 1}: </span>
                    {step.title}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Privacy */}
      <section aria-labelledby="privacy-heading" className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="privacy-heading" className="text-xl font-bold text-ink sm:text-2xl">
              Privacy by design
            </h2>
            <p className="mt-4 text-[0.975rem] leading-7 text-ink-soft">
              The supported image operations — compression, resizing and format conversion — are
              performed locally in your browser. Your files are decoded, processed and prepared for
              download on your device, and are not uploaded by those operations.
            </p>
            <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
              Text you type into the Word Counter stays in the page. Like any website, loading
              SnapKit pages creates standard request logs on the hosting provider; SnapKit itself
              runs no analytics and, until configured and approved, no advertising. If that ever
              changes, it will be disclosed here and on the{' '}
              <Link to="/privacy-policy/" className="font-medium text-brand underline">
                Privacy Policy
              </Link>{' '}
              before any non-essential cookies are set.
            </p>
            <Link to="/privacy-policy/" className="btn-secondary mt-5">
              Read the full Privacy Policy
            </Link>
          </div>
          <div className="rounded-card border border-success/25 bg-success-soft p-6">
            <ShieldCheck className="h-7 w-7 text-success" aria-hidden="true" />
            <h3 className="mt-3 text-base font-semibold text-ink">What never happens</h3>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>✗ Your images are never sent to a server by the tools.</li>
              <li>✗ Your typed text is never uploaded or logged.</li>
              <li>✗ No account, no tracking pixels, no dark patterns.</li>
              <li>✗ No claim of guaranteed results — just working tools.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Learning resources */}
      <section aria-labelledby="learn-heading" className="mx-auto max-w-6xl px-4 pb-4 pt-14 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id="learn-heading" className="text-xl font-bold text-ink sm:text-2xl">
            <Lightbulb className="mr-2 inline h-5 w-5 text-accent" aria-hidden="true" />
            Learning resources
          </h2>
          <Link to="/guides/" className="text-sm font-semibold text-brand hover:underline">
            All guides →
          </Link>
        </div>
        <ul className="mt-5 grid gap-4 sm:grid-cols-3">
          {GUIDE_META.slice(0, 3).map((guide) => (
            <li key={guide.slug}>
              <Link to={guidePath(guide.slug)} className="card flex h-full flex-col gap-2 p-5 hover:border-brand/40">
                <span className="text-base font-semibold text-ink group-hover:text-brand">
                  {guide.title}
                </span>
                <span className="text-sm leading-6 text-muted">{guide.description}</span>
                <span className="mt-auto pt-2 text-sm font-semibold text-brand">Read guide →</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
