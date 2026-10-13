import { useEffect, useState } from 'react';
import { advertisingConfigured, readConsent } from '../lib/consent';

interface AdSlotProps {
  /** Stable slot identifier used once real ad units are created. */
  slot: string;
  className?: string;
}

const AD_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT ?? '';
const AD_SCRIPT_ID = 'snapkit-adsense-script';

/**
 * Optional Google AdSense slot.
 *
 * Renders nothing unless BOTH are true:
 *  1. a real publisher ID is configured (VITE_ADSENSE_CLIENT), and
 *  2. the visitor granted consent for advertising cookies.
 *
 * Until an application is approved and a publisher ID exists, this component
 * is inert — no script, no requests, no markup. It never impersonates a
 * download button or a tool control.
 */
export function AdSlot({ slot, className = '' }: AdSlotProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!advertisingConfigured()) return;
    if (readConsent().ads !== 'granted') return;

    if (!document.getElementById(AD_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = AD_SCRIPT_ID;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(AD_CLIENT)}`;
      document.head.appendChild(script);
    }

    try {
      ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ??=
        []).push({});
    } catch {
      // Ad script not ready yet; it will pick up subsequent pushes.
    }
    setReady(true);
  }, []);

  if (!advertisingConfigured() || !ready) return null;

  return (
    <aside
      aria-label="Advertisement"
      className={`ad-slot flex min-h-[90px] items-center justify-center rounded-lg border border-dashed border-line bg-surface p-3 text-center text-xs text-muted ${className}`}
    >
      <ins
        className="adsbygoogle block w-full"
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
