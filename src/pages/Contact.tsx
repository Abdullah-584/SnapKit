import { Link } from 'react-router-dom';
import { Mail, MessageSquareWarning } from 'lucide-react';
import { PageShell } from '../components/PageShell';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL?.trim() || '';

export function Contact() {
  return (
    <PageShell crumbs={[{ label: 'Contact Us' }]} title="Contact Us">
      {CONTACT_EMAIL ? (
        <section aria-labelledby="reach" className="card p-6">
          <h2 id="reach" className="text-lg font-bold text-ink">Email us</h2>
          <p className="mt-2 text-[0.975rem] leading-7 text-ink-soft">
            The fastest way to reach SnapKit is email. We read every message, though we cannot
            promise an instant reply.
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-3">
            <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary">
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>
      ) : (
        <section aria-labelledby="pending" className="card border-warning/40 bg-warning-soft p-6">
          <h2 id="pending" className="flex items-center gap-2 text-lg font-bold text-ink">
            <MessageSquareWarning className="h-5 w-5 text-warning" aria-hidden="true" />
            Contact channel not configured yet
          </h2>
          <p className="mt-2 text-[0.975rem] leading-7 text-ink-soft">
            SnapKit does not publish an email address we cannot receive messages at, and this
            deployment has no contact address configured yet — so instead of showing a form that
            would silently go nowhere, we say so plainly.
          </p>
          <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
            When the mailbox is set (site operators: set <code>VITE_CONTACT_EMAIL</code> — see the
            README), a one-click email address appears right here. Until then, the{' '}
            <Link to="/privacy-policy/" className="font-medium text-brand underline">
              Privacy Policy
            </Link>{' '}
            explains what data this site does and does not handle.
          </p>
        </section>
      )}

      <section aria-labelledby="include">
        <h2 id="include" className="text-xl font-bold text-ink">What to include</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.975rem] leading-7 text-ink-soft">
          <li>Which tool or page you are writing about (a link helps).</li>
          <li>What you expected to happen and what happened instead.</li>
          <li>Your browser and device if a tool misbehaved — SnapKit never sees your files, so we cannot look for you.</li>
          <li>
            A specification that looks out of date (social media dimensions change often — the
            source link on each row lets us re-verify quickly).
          </li>
        </ul>
      </section>

      <section aria-labelledby="other">
        <h2 id="other" className="text-xl font-bold text-ink">Other questions</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.975rem] leading-7 text-ink-soft">
          <li>
            How data is handled → <Link to="/privacy-policy/" className="font-medium text-brand underline">Privacy Policy</Link>
          </li>
          <li>
            Rules for using the site → <Link to="/terms-of-use/" className="font-medium text-brand underline">Terms of Use</Link>
          </li>
          <li>
            Cookie and privacy choices → <Link to="/cookie-preferences/" className="font-medium text-brand underline">Cookie Preferences</Link>
          </li>
        </ul>
      </section>
    </PageShell>
  );
}
