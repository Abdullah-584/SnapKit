import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';
import { NoteBox } from '../components/ToolPage';
import { TOOLS } from '../lib/tools';
import { GUIDE_META } from '../lib/guides';

export function About() {
  return (
    <PageShell crumbs={[{ label: 'About Us' }]} title="About Us">
      <section aria-labelledby="what">
        <h2 id="what" className="text-xl font-bold text-ink">What SnapKit is</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit is a small, focused collection of free online tools for everyday tasks: shrinking
          and resizing images, converting image formats, counting words, and looking up social
          media image dimensions. The tagline is <strong>Free Tools. Quick Results.</strong>, and
          the goal is literal — open a page, do the task, download the result, leave.
        </p>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          There is no account system, no dashboard and no upsell. Every tool on the site works
          without registration and states its own limits plainly.
        </p>
      </section>

      <section aria-labelledby="who">
        <h2 id="who" className="text-xl font-bold text-ink">Who it is for</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Anyone with a quick, concrete job to do: a student fitting an essay to a word limit, a
          small business owner shrinking a photo before attaching it to an email, a marketer who
          needs a 1080 × 1350 post and does not want to open a full design suite for one file.
          The interface and guides are written in plain English for a global audience.
        </p>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="text-xl font-bold text-ink">How SnapKit handles your files</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          The supported image operations run <strong>locally in your browser</strong>. Your picture
          is decoded and re-encoded on your device with the browser's own canvas API, and the tool
          never uploads the file. Text typed into the Word Counter stays inside the page. Like any
          website, loading our pages creates standard request logs on our hosting provider — that
          is page traffic, not your file contents.
        </p>
        <div className="mt-4">
          <NoteBox tone="privacy">
            The full details — logs, local storage, advertising policy and your rights — are in the{' '}
            <Link to="/privacy-policy/" className="font-medium text-brand underline">
              Privacy Policy
            </Link>
            .
          </NoteBox>
        </div>
      </section>

      <section aria-labelledby="what-we-built">
        <h2 id="what-we-built" className="text-xl font-bold text-ink">What is published now</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.975rem] leading-7 text-ink-soft">
          {TOOLS.map((tool) => (
            <li key={tool.id}>
              <Link to={tool.path} className="font-medium text-brand hover:underline">
                {tool.name}
              </Link>{' '}
              — {tool.summary}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Plus {GUIDE_META.length} original guides in the{' '}
          <Link to="/guides/" className="font-medium text-brand hover:underline">
            Guides and Tutorials
          </Link>{' '}
          section.
        </p>
      </section>

      <section aria-labelledby="honesty">
        <h2 id="honesty" className="text-xl font-bold text-ink">How we keep this honest</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.975rem] leading-7 text-ink-soft">
          <li>Size and reduction figures are measured from your actual files — never invented.</li>
          <li>
            Social media dimensions carry a verification date and a link to the source they came
            from, labelled as official or as community convention.
          </li>
          <li>Guides show a last-reviewed date and cite the references behind technical claims.</li>
          <li>We do not promise rankings, earnings or approval of anything — including AdSense.</li>
        </ul>
      </section>

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="text-xl font-bold text-ink">Contact</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Found a bug, or is a specification out of date? Head to the{' '}
          <Link to="/contact/" className="font-medium text-brand hover:underline">
            Contact page
          </Link>{' '}
          for the current way to reach us.
        </p>
      </section>
    </PageShell>
  );
}
