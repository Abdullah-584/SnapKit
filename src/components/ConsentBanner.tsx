import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import { setConsent, shouldShowBanner } from '../lib/consent';

/**
 * Consent banner. Rendered only when an advertising or analytics integration
 * is actually configured — SnapKit ships with none, so by default nothing
 * appears. Choices persist in localStorage and can be changed at any time on
 * the Cookie & Privacy Preferences page.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(shouldShowBanner());
  }, []);

  if (!visible) return null;

  const decide = (value: 'granted' | 'denied') => {
    setConsent('ads', value);
    setConsent('analytics', value);
    setVisible(false);
  };

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/98 p-4 shadow-[0_-8px_30px_rgb(16_32_63_/0.12)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <p className="text-sm text-ink-soft">
            <strong className="font-semibold text-ink">Your choice matters.</strong> SnapKit's tools
            work without tracking. If advertising is enabled on this site, we ask before any
            advertising cookies are set. Read the{' '}
            <Link to="/privacy-policy/" className="font-medium text-brand underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link to="/cookie-preferences/" className="btn-secondary">
            Preferences
          </Link>
          <button type="button" className="btn-secondary" onClick={() => decide('denied')}>
            Reject non-essential
          </button>
          <button type="button" className="btn-primary" onClick={() => decide('granted')}>
            Accept
          </button>
        </div>
      </div>
    </section>
  );
}
