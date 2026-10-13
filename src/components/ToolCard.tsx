import { Link } from 'react-router-dom';
import { ArrowRight, Minimize2, RefreshCw, Ruler, Scaling, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CATEGORY_META, type ToolMeta } from '../lib/tools';

const ICONS: Record<string, LucideIcon> = {
  Minimize2,
  Scaling,
  RefreshCw,
  Type,
  Ruler,
};

export function ToolIcon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Minimize2;
  return <Icon className={className} aria-hidden="true" />;
}

export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <Link
      to={tool.path}
      className="card group flex h-full flex-col gap-3 p-5 transition-shadow hover:shadow-[0_2px_16px_rgb(16_32_63_/0.12)] focus-visible:outline-2 focus-visible:outline-brand"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <ToolIcon name={tool.icon} className="h-5 w-5" />
        </span>
        <span className="chip">{CATEGORY_META[tool.category].name}</span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-ink group-hover:text-brand">{tool.name}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted">{tool.summary}</p>
      </div>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
        Open tool
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </Link>
  );
}
