import type { ReactNode } from 'react';
import { AlertTriangle, LoaderCircle } from 'lucide-react';

/** Accessible loading state for expensive operations (e.g. image encoding). */
export function LoadingState({ label = 'Working…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-2.5 text-sm text-ink-soft">
      <LoaderCircle className="h-4 w-4 animate-spin text-brand" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/** Error state. Uses role="alert" so failures are announced. */
export function ErrorState({ title = 'Something went wrong', message }: { title?: string; message: string }) {
  return (
    <div
      role="alert"
      className="rounded-card border border-danger/30 bg-danger-soft px-4 py-3.5 text-sm"
    >
      <p className="flex items-start gap-2 font-semibold text-danger">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-1 text-ink-soft">{message}</p>
    </div>
  );
}

/** Empty state for lists and results. */
export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-card border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted">{message}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
