/**
 * Text statistics with explicitly documented counting rules.
 *
 * Rules (also shown in the Word Counter UI):
 * - Words: contiguous runs of non-whitespace characters. Text without spaces
 *   (e.g. Chinese, Japanese) counts as one word per contiguous block.
 * - Characters: Unicode code points (an accented letter counts once; a flag or
 *   family emoji built from several code points counts as several).
 * - Characters without spaces: the same count with every whitespace character
 *   (space, tab, newline, Unicode spaces) removed.
 * - Paragraphs: non-empty blocks separated by one or more blank lines. A single
 *   line break does not start a new paragraph.
 * - Sentences: text split at `.`, `!`, `?` or `…` followed by whitespace or the
 *   end of the text. Abbreviations and decimals are not detected, so the count
 *   is an approximation.
 * - Reading time: words ÷ 200 words per minute, rounded to the nearest minute
 *   (minimum 1 minute for any non-empty text). Always an estimate.
 */

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  paragraphs: number;
  sentences: number;
  lines: number;
  readingMinutes: number;
}

export function countText(text: string): TextStats {
  const words = text.split(/\s+/u).filter(Boolean).length;

  const characters = Array.from(text).length;
  const charactersNoSpaces = Array.from(text.replace(/\s+/gu, '')).length;

  const paragraphBlocks = text.split(/\n\s*\n/u).map((block) => block.trim()).filter(Boolean);
  const paragraphs = paragraphBlocks.length;

  const sentences = text.split(/(?<=[.!?…])\s+/u).filter((s) => s.trim().length > 0).length;

  const lines = text.length === 0 ? 0 : text.split(/\r\n|\r|\n/u).length;

  let readingMinutes = 0;
  if (words > 0) {
    readingMinutes = Math.max(1, Math.round(words / 200));
  }

  return { words, characters, charactersNoSpaces, paragraphs, sentences, lines, readingMinutes };
}

export const COUNTING_RULES: { label: string; rule: string }[] = [
  { label: 'Words', rule: 'Runs of characters separated by whitespace. No-space scripts count as one word per block.' },
  { label: 'Characters', rule: 'Unicode code points, including spaces, punctuation and emoji.' },
  { label: 'No spaces', rule: 'Characters with every whitespace character removed.' },
  { label: 'Paragraphs', rule: 'Non-empty blocks separated by blank lines; a single line break does not split them.' },
  { label: 'Sentences', rule: 'Split at . ! ? … followed by a space or the end of the text. Abbreviations are not detected.' },
  { label: 'Reading time', rule: 'Words ÷ 200 words per minute, rounded — an estimate, not a measurement.' },
];

const BYTE_UNITS = ['B', 'KB', 'MB', 'GB'] as const;

/** Human-readable file size using binary units (1 KB = 1024 B). */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < 1024) return `${bytes} B`;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < BYTE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${BYTE_UNITS[unit]}`;
}

/**
 * Size change between original and result.
 * Returns a negative percentage for a reduction (e.g. -62.4) or a positive
 * one for growth. Returns null when either size is unusable.
 */
export function sizeReductionPercent(originalBytes: number, resultBytes: number): number | null {
  if (!Number.isFinite(originalBytes) || !Number.isFinite(resultBytes) || originalBytes <= 0) {
    return null;
  }
  return ((originalBytes - resultBytes) / originalBytes) * 100;
}

/** Label for a reduction (never fabricated — computed from real byte counts). */
export function reductionLabel(originalBytes: number, resultBytes: number): string | null {
  const pct = sizeReductionPercent(originalBytes, resultBytes);
  if (pct === null) return null;
  if (pct > 0) return `${pct.toFixed(1)}% smaller`;
  if (pct < 0) return `${Math.abs(pct).toFixed(1)}% larger`;
  return 'same size';
}
