import { useState } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { PageShell } from '../components/PageShell';
import {
  advertisingConfigured,
  analyticsConfigured,
  readConsent,
  setConsent,
  UNSET,
} from '../lib/consent';
import type { ConsentState, ConsentValue } from '../lib/consent';

function valueLabel(value: ConsentValue | 'unset', available: boolean): string {
  if (!available) return 'Not integrated';
  if (value === 'granted') return 'Allowed';
  if (value === 'denied') return 'Blocked';
  return 'No choice yet';
}

export function CookiePreferences() {
  const [consent, setConsentState] = useState<ConsentState>(() => readConsent());
  const adsAvailable = advertisingConfigured();
  const analyticsAvailable = analyticsConfigured();

  function update(key: keyof ConsentState, value: ConsentValue) {
    setConsentState(setConsent(key, value));
  }

  function reset() {
    try {
      window.localStorage.removeItem('snapkit-consent-v1');
    } catch {
      // Storage blocked — nothing to clear.
    }
    setConsentState({ ...UNSET });
  }

  return (
    <PageShell
      crumbs={[{ label: 'Cookie & Privacy Preferences' }]}
      title="Cookie & Privacy Preferences"
      intro="Review what this site currently uses, and change any choice you have made before."
    >
      <section aria-labelledby="status" className="card p-6">
        <h2 id="status" className="flex items-center gap-2 text-lg font-bold text-ink">
          <ShieldCheck className="h-5 w-5 text-success" aria-hidden="true" />
          Current status of this site
        </h2>
        <ul className="mt-4 space-y-3 text-[0.975rem] leading-7 text-ink-soft">
          <li>
            <strong className="text-ink">Essential storage:</strong> none required. The tools work
            without any cookies or local storage.
          </li>
          <li>
            <strong className="text-ink">Analytics:</strong>{' '}
            {analyticsAvailable
              ? 'integrated — see the Privacy Policy.'
              : 'not integrated. SnapKit runs no analytics service and sends no usage data.'}
          </li>
          <li>
            <strong className="text-ink">Advertising:</strong>{' '}
            {adsAvailable
              ? 'configured — advertising cookies require your consent below.'
              : 'not configured. No ad code loads and no advertising cookies are set.'}
          </li>
          <li>
            <strong className="text-ink">Your stored choice:</strong> your browser currently
            reports ads = <em>{valueLabel(consent.ads, adsAvailable)}</em>, analytics ={' '}
            <em>{valueLabel(consent.analytics, analyticsAvailable)}</em>.
          </li>
        </ul>
      </section>

      <section aria-labelledby="choices" className="card p-6">
        <h2 id="choices" className="flex items-center gap-2 text-lg font-bold text-ink">
          <Cookie className="h-5 w-5 text-accent" aria-hidden="true" />
          Your choices
        </h2>
        <p className="mt-2 text-sm text-muted">
          Choices are stored only in this browser (key <code>snapkit-consent-v1</code>) and can be
          cleared at any time. Where a category is not integrated, the toggle has no effect — we
          keep it visible so the state is honest rather than hidden.
        </p>

        <div className="mt-5 space-y-4">
          <fieldset className="rounded-card border border-line bg-surface p-4">
            <legend className="px-1 text-sm font-semibold text-ink">Analytics</legend>
            <p className="text-sm text-muted">{valueLabel(consent.analytics, analyticsAvailable)}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={consent.analytics === 'granted' ? 'btn-primary' : 'btn-secondary'}
                disabled={!analyticsAvailable}
                aria-pressed={consent.analytics === 'granted'}
                onClick={() => update('analytics', 'granted')}
              >
                Allow
              </button>
              <button
                type="button"
                className={consent.analytics === 'denied' ? 'btn-primary' : 'btn-secondary'}
                disabled={!analyticsAvailable}
                aria-pressed={consent.analytics === 'denied'}
                onClick={() => update('analytics', 'denied')}
              >
                Block
              </button>
            </div>
          </fieldset>

          <fieldset className="rounded-card border border-line bg-surface p-4">
            <legend className="px-1 text-sm font-semibold text-ink">Advertising cookies</legend>
            <p className="text-sm text-muted">{valueLabel(consent.ads, adsAvailable)}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className={consent.ads === 'granted' ? 'btn-primary' : 'btn-secondary'}
                disabled={!adsAvailable}
                aria-pressed={consent.ads === 'granted'}
                onClick={() => update('ads', 'granted')}
              >
                Allow
              </button>
              <button
                type="button"
                className={consent.ads === 'denied' ? 'btn-primary' : 'btn-secondary'}
                disabled={!adsAvailable}
                aria-pressed={consent.ads === 'denied'}
                onClick={() => update('ads', 'denied')}
              >
                Block
              </button>
            </div>
          </fieldset>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn-secondary" onClick={reset}>
            Forget my choices on this device
          </button>
        </div>
      </section>

      <section aria-labelledby="details">
        <h2 id="details" className="text-xl font-bold text-ink">How this works</h2>
        <p className="mt-3 text-[0.975rem] leading-7 text-ink-soft">
          Consent here is granular and reversible: allow or block each category independently, or
          reset everything and be asked again (when something exists to ask about). Blocking has no
          downside — every tool on the site works fully without advertising or analytics. See the{' '}
          <a href="/privacy-policy/" className="font-medium text-brand underline">
            Privacy Policy
          </a>{' '}
          for how data is handled in each case.
        </p>
      </section>
    </PageShell>
  );
}
