import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

const LAST_UPDATED = '2026-10-12';

export function TermsOfUse() {
  return (
    <PageShell
      crumbs={[{ label: 'Terms of Use' }]}
      title="Terms of Use"
      intro="The agreement for using SnapKit: what you may do, what the tools do and do not guarantee, and how liability is limited."
    >
      <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <section aria-labelledby="acceptance">
        <h2 id="acceptance" className="text-xl font-bold text-ink">1. Acceptance</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          By using SnapKit you agree to these terms. If you do not agree, please do not use the
          site. The site is provided free of charge for everyday personal and business tasks.
        </p>
      </section>

      <section aria-labelledby="permitted">
        <h2 id="permitted" className="text-xl font-bold text-ink">2. Permitted use</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.975rem] leading-7 text-ink-soft">
          <li>You may use the tools for lawful personal, educational or commercial purposes.</li>
          <li>
            You are responsible for the files and text you process and for having the right to use
            them — SnapKit does not inspect or store your content.
          </li>
          <li>
            Do not attempt to disrupt the site, scrape it at scale, hotlink assets in a way that
            degrades service, or use it for anything unlawful.
          </li>
          <li>
            Automated bulk access requires prior written permission; the free tier exists for
            humans doing everyday tasks.
          </li>
        </ul>
      </section>

      <section aria-labelledby="service">
        <h2 id="service" className="text-xl font-bold text-ink">3. The service “as is”</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit is provided <strong>as is and as available</strong>, without warranty of any
          kind. In particular:
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.975rem] leading-7 text-ink-soft">
          <li>
            Tools depend on your browser's codecs and canvas limits; results can differ between
            browsers and devices.
          </li>
          <li>
            Guides and the Social Image Size Guide are compiled from sources with a stated
            verification date — platforms change their specs without notice, so always check the
            linked source for time-critical decisions.
          </li>
          <li>
            No guarantee of uninterrupted availability, of any particular compression ratio, or of
            suitability for a particular purpose.
          </li>
        </ul>
      </section>

      <section aria-labelledby="ip">
        <h2 id="ip" className="text-xl font-bold text-ink">4. Intellectual property</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit's own content — logo, design, original articles and code — belongs to SnapKit or
          its licensors. You may quote our guides with attribution and a link. Platform names,
          logos and trademarks (Facebook, Instagram, X, LinkedIn, YouTube, Pinterest, TikTok, and
          others) belong to their respective owners; their mention is descriptive and does not
          imply endorsement or affiliation.
        </p>
      </section>

      <section aria-labelledby="liability">
        <h2 id="liability" className="text-xl font-bold text-ink">5. Limitation of liability</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          To the fullest extent permitted by law, SnapKit and its operators shall not be liable for
          any indirect, incidental or consequential damages — including loss of data, lost profits
          or damages arising from your reliance on a dimension, size or count shown on the site —
          arising from use of or inability to use the service. Some jurisdictions do not allow
          certain limitations, so parts of this clause may not apply to you.
        </p>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Keep backups of your original files: always process copies, because a wrong export can
          overwrite a file you care about.
        </p>
      </section>

      <section aria-labelledby="changes-terms">
        <h2 id="changes-terms" className="text-xl font-bold text-ink">6. Changes</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          These terms may be updated; the revision date at the top changes with each update.
          Continued use after an update means you accept the revised terms.
        </p>
      </section>

      <section aria-labelledby="contact-terms">
        <h2 id="contact-terms" className="text-xl font-bold text-ink">7. Contact</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Questions about these terms go through the{' '}
          <Link to="/contact/" className="font-medium text-brand underline">
            Contact page
          </Link>
          . See also the{' '}
          <Link to="/privacy-policy/" className="font-medium text-brand underline">
            Privacy Policy
          </Link>{' '}
          for how data is handled.
        </p>
      </section>
    </PageShell>
  );
}
