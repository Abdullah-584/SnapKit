/**
 * Consent storage.
 *
 * SnapKit ships no analytics. Advertising slots stay disabled until a real
 * AdSense publisher ID is configured (VITE_ADSENSE_CLIENT) — and even then no
 * ad script loads before the visitor records a choice here.
 */

export type ConsentValue = 'granted' | 'denied';
export type ConsentState = { ads: ConsentValue | 'unset'; analytics: ConsentValue | 'unset' };

const STORAGE_KEY = 'snapkit-consent-v1';

export const UNSET: ConsentState = { ads: 'unset', analytics: 'unset' };

function hasStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readConsent(): ConsentState {
  if (!hasStorage()) return { ...UNSET };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...UNSET };
    const parsed = JSON.parse(raw) as Partial<ConsentState>;
    return {
      ads: parsed.ads === 'granted' || parsed.ads === 'denied' ? parsed.ads : 'unset',
      analytics: parsed.analytics === 'granted' || parsed.analytics === 'denied' ? parsed.analytics : 'unset',
    };
  } catch {
    return { ...UNSET };
  }
}

export function writeConsent(state: ConsentState): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be blocked; choices then last for this page view only.
  }
}

export function setConsent(key: keyof ConsentState, value: ConsentValue): ConsentState {
  const next = { ...readConsent(), [key]: value };
  writeConsent(next);
  return next;
}

/** True when an advertising integration is configured (it is not, by default). */
export function advertisingConfigured(): boolean {
  return Boolean(import.meta.env.VITE_ADSENSE_CLIENT);
}

/** SnapKit currently runs no analytics integration. */
export function analyticsConfigured(): boolean {
  return false;
}

/** The banner only appears when there is something to consent to. */
export function shouldShowBanner(): boolean {
  if (typeof window === 'undefined') return false;
  if (!advertisingConfigured() && !analyticsConfigured()) return false;
  const state = readConsent();
  return state.ads === 'unset' && state.analytics === 'unset';
}
