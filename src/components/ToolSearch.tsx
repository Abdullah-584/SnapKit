import { useMemo, useState } from 'react';
import { Search, SearchX, X } from 'lucide-react';
import { searchTools, TOOLS, type ToolMeta } from '../lib/tools';
import { ToolCard } from './ToolCard';

interface ToolSearchProps {
  /** Render all tools when the query is empty (used on the full directory). */
  showAllWhenEmpty?: boolean;
  id?: string;
}

/**
 * Searchable tool directory control: filters by name and purpose as you type,
 * with explicit empty and no-results states.
 */
export function ToolSearch({ showAllWhenEmpty = true, id = 'tool-search' }: ToolSearchProps) {
  const [query, setQuery] = useState('');

  const results: ToolMeta[] = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return showAllWhenEmpty ? TOOLS : [];
    return searchTools(trimmed);
  }, [query, showAllWhenEmpty]);

  const isSearching = query.trim().length > 0;

  return (
    <div>
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Search tools by name or purpose
        </label>
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tools… e.g. compress, resize, word count"
          className="input h-12 pl-10 pr-10 text-base"
          autoComplete="off"
        />
        {isSearching && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-surface hover:text-ink"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <p role="status" aria-live="polite" className="mt-3 text-sm text-muted">
        {isSearching
          ? results.length === 0
            ? `No tools match “${query.trim()}”.`
            : `${results.length} tool${results.length === 1 ? '' : 's'} found.`
          : `Showing all ${results.length} tools.`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <li key={tool.id}>
              <ToolCard tool={tool} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-card border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
          <SearchX className="mx-auto h-8 w-8 text-muted" aria-hidden="true" />
          <h3 className="mt-3 text-base font-semibold text-ink">No matching tools</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            Nothing matches “{query.trim()}”. Try a broader word like “image”, “text” or
            “convert” — or reset the search to see everything.
          </p>
          <button type="button" className="btn-secondary mt-4" onClick={() => setQuery('')}>
            Reset search
          </button>
        </div>
      )}
    </div>
  );
}
