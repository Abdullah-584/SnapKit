interface LogoProps {
  className?: string;
  /** Hide the wordmark (used where space is tight). */
  markOnly?: boolean;
}

/**
 * Original SnapKit mark: a rounded square cut by a spark/bolt, drawn as SVG.
 * No third-party artwork involved.
 */
export function Logo({ className = 'h-9', markOnly = false }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 48 48"
        role="img"
        aria-label="SnapKit logo"
        className="h-full w-auto shrink-0"
      >
        <defs>
          <linearGradient id="snapkit-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#snapkit-mark)" />
        <path
          d="M27.5 8.5 13 26.8h9.4L20 39.5 35 20.8h-9.6l2.1-12.3Z"
          fill="#ffffff"
        />
        <circle cx="36.5" cy="11.5" r="2.6" fill="#ffffff" opacity="0.85" />
      </svg>
      {!markOnly && (
        <span className="text-lg font-bold tracking-tight text-ink">
          Snap<span className="text-brand">Kit</span>
        </span>
      )}
    </span>
  );
}
