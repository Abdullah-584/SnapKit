import { useMemo, useState } from 'react';
import { Check, Clipboard, Eraser, Sparkles, Type } from 'lucide-react';
import { COUNTING_RULES, countText } from '../lib/formatters';

const SAMPLE_TEXT = `SnapKit runs entirely in your browser.

Paste your text here, or load this sample to see how the counters work. Each sentence ends with a period, question mark or exclamation mark — that is how sentences are counted.`;

/** Word Counter — live statistics with documented rules. */
export function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => countText(text), [text]);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard permission denied — the textarea remains selectable.
      setCopied(false);
    }
  }

  const cards: { label: string; value: string | number; hint?: string }[] = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'No spaces', value: stats.charactersNoSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: stats.words === 0 ? '—' : `~${stats.readingMinutes} min`, hint: 'at 200 wpm' },
  ];

  return (
    <section aria-label="Word counter tool" className="card p-5 sm:p-6">
      <label htmlFor="word-counter-input" className="label">
        Your text
      </label>
      <textarea
        id="word-counter-input"
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={12}
        placeholder="Start typing or paste your text…"
        className="input mt-1.5 min-h-64 resize-y font-normal leading-7"
        aria-describedby="word-counter-rules"
      />

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-secondary" onClick={copyText} disabled={text.length === 0}>
          {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Clipboard className="h-4 w-4" aria-hidden="true" />}
          {copied ? 'Copied' : 'Copy text'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setText('');
            setCopied(false);
          }}
          disabled={text.length === 0}
        >
          <Eraser className="h-4 w-4" aria-hidden="true" />
          Clear
        </button>
        <button type="button" className="btn-secondary" onClick={() => setText(SAMPLE_TEXT)}>
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Load sample text
        </button>
        <span className="text-xs text-muted">Text never leaves this browser tab.</span>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {stats.words} words, {stats.characters} characters.
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-line bg-surface px-3.5 py-3">
            <dt className="text-xs font-medium text-muted">{card.label}</dt>
            <dd className="mt-1 text-2xl font-bold tracking-tight text-ink">{card.value}</dd>
            {card.hint && <p className="mt-0.5 text-[11px] text-muted">{card.hint}</p>}
          </div>
        ))}
      </dl>

      <details id="word-counter-rules" className="mt-5 rounded-card border border-line bg-white px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-ink">
          <Type className="mr-1.5 inline h-4 w-4 text-brand" aria-hidden="true" />
          How these numbers are counted
        </summary>
        <dl className="mt-3 space-y-2 text-sm text-ink-soft">
          {COUNTING_RULES.map((rule) => (
            <div key={rule.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
              <dt className="font-semibold text-ink sm:w-28 sm:shrink-0">{rule.label}</dt>
              <dd>{rule.rule}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
            <dt className="font-semibold text-ink sm:w-28 sm:shrink-0">Lines</dt>
            <dd>Every line break starts a new line (counted for layout, not shown in the cards).</dd>
          </div>
        </dl>
      </details>
    </section>
  );
}
