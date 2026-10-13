import { Link } from 'react-router-dom';
import { PageShell } from '../components/PageShell';

const LAST_UPDATED = '2026-10-12';

export function PrivacyPolicy() {
  return (
    <PageShell
      crumbs={[{ label: 'Privacy Policy' }]}
      title="Privacy Policy"
      intro="What SnapKit actually does with data — written to match how this site really works, not to sound impressive."
    >
      <p className="text-sm text-muted">Last updated: {LAST_UPDATED}</p>

      <section aria-labelledby="scope">
        <h2 id="scope" className="text-xl font-bold text-ink">1. Overview</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit is a browser-based collection of image and text tools. The design goal is simple:
          your files and text should be processed on your device, not on ours. This policy
          describes the data involved in using the site, who processes it, and the choices you
          have. It is a plain-language description of actual practices, not legal certification.
        </p>
      </section>

      <section aria-labelledby="tools-data">
        <h2 id="tools-data" className="text-xl font-bold text-ink">2. Your files and text</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          The supported image operations (compression, resizing, format conversion) are performed{' '}
          <strong>locally in your browser</strong>. Images you select are decoded and re-encoded on
          your device; <strong>those operations do not upload your files</strong> to SnapKit or to
          any third party. Text you enter in the Word Counter is handled in page memory as you
          type and is not transmitted by SnapKit.
        </p>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Because processing is local, we cannot see your files — which also means support cannot
          inspect a file that fails on your device; you would need to describe the problem instead.
        </p>
      </section>

      <section aria-labelledby="logs">
        <h2 id="logs" className="text-xl font-bold text-ink">3. Server and hosting logs</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Loading any website sends requests to a server, and our hosting provider processes
          standard technical logs to deliver the pages. These logs typically include your IP
          address, the time, the page requested, and your browser's user agent — like any web
          server. This is hosting infrastructure data, separate from your files, which never reach
          those servers.
        </p>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          The site is hosted on the provider associated with its domain (snapkit.42web.io); that
          provider processes such logs under its own privacy policy. No database, account system
          or backend application of ours stores personal data from using the tools.
        </p>
      </section>

      <section aria-labelledby="cookies">
        <h2 id="cookies" className="text-xl font-bold text-ink">4. Cookies and local storage</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          By default SnapKit sets <strong>no advertising or analytics cookies</strong> and runs no
          analytics service. The only local storage the site may write is a small preference key (
          <code>snapkit-consent-v1</code>) if you make a choice on the{' '}
          <Link to="/cookie-preferences/" className="font-medium text-brand underline">
            Cookie &amp; Privacy Preferences
          </Link>{' '}
          page, so your choice can be remembered on this device.
        </p>
      </section>

      <section aria-labelledby="ads">
        <h2 id="ads" className="text-xl font-bold text-ink">5. Advertising (if ever enabled)</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit contains an optional advertising integration that is <strong>disabled by
          default</strong>: no ad code loads, and no advertising cookies are set, unless a real
          publisher ID is configured <em>and</em> you have granted consent. If advertising is ever
          enabled, this section and the preferences page will state it clearly before any ad
          technology runs, and Google's advertising technologies would then process data under
          Google's own policies.
        </p>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Current status: <strong>no advertising integration is configured on this site.</strong>
        </p>
      </section>

      <section aria-labelledby="third-parties">
        <h2 id="third-parties" className="text-xl font-bold text-ink">6. Third parties</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          The tools make no third-party API calls with your content. The only third-party
          processing associated with the site is the hosting provider's delivery of pages (section
          3) and, if it is ever configured and consented to, the advertising integration
          (section 5). External links to platform documentation take you to those platforms' own
          sites, governed by their policies.
        </p>
      </section>

      <section aria-labelledby="retention">
        <h2 id="retention" className="text-xl font-bold text-ink">7. Retention</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit stores no copies of your images or text — closing the tab removes them. Consent
          preferences remain in your browser's local storage until you clear them (the preferences
          page has a reset). Hosting logs are retained for as long as the hosting provider keeps
          them for its own operational purposes; message content you send us is kept only as long
          as needed to handle your request.
        </p>
      </section>

      <section aria-labelledby="rights">
        <h2 id="rights" className="text-xl font-bold text-ink">8. Your rights</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Depending on where you live (for example under GDPR or CCPA-style laws), you may have
          rights to access, correct, delete or restrict processing of personal data about you, and
          to object to certain processing. Because SnapKit holds almost no data, most requests
          concern hosting logs or messages you have sent us — we will help you route such requests
          or act on them where we can. Contact us via the{' '}
          <Link to="/contact/" className="font-medium text-brand underline">
            Contact page
          </Link>
          .
        </p>
      </section>

      <section aria-labelledby="children">
        <h2 id="children" className="text-xl font-bold text-ink">9. Children</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          SnapKit is a general-audience tools site and does not knowingly collect personal
          information from anyone, including children. If you believe data has been provided to us,
          contact us and we will remove it.
        </p>
      </section>

      <section aria-labelledby="changes">
        <h2 id="changes" className="text-xl font-bold text-ink">10. Changes to this policy</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          When the site's practices change — new integrations, new tools — this page is updated
          with a new “Last updated” date, and consent-dependent features stay off until a fresh
          choice is made where required.
        </p>
      </section>

      <section aria-labelledby="disclaimer">
        <h2 id="disclaimer" className="text-xl font-bold text-ink">11. Important note</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          This document describes actual technical behaviour but is not legal advice and does not
          claim any legal certification. Have it reviewed for your jurisdiction before relying on
          it for compliance purposes.
        </p>
      </section>
    </PageShell>
  );
}
