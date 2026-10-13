import { describe, expect, it } from 'vitest';
import { countText, formatBytes, reductionLabel, sizeReductionPercent } from './formatters';

describe('countText', () => {
  it('returns all zeros for empty text', () => {
    expect(countText('')).toEqual({
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      paragraphs: 0,
      sentences: 0,
      lines: 0,
      readingMinutes: 0,
    });
  });

  it('counts whitespace-separated words', () => {
    const stats = countText('one two   three\tfour');
    expect(stats.words).toBe(4);
    expect(stats.characters).toBe(20);
    expect(stats.charactersNoSpaces).toBe(15);
  });

  it('counts paragraphs only on blank lines', () => {
    expect(countText('line one\nline two').paragraphs).toBe(1);
    expect(countText('line one\n\nline two').paragraphs).toBe(2);
    expect(countText('a\n\n\nb\n\nc').paragraphs).toBe(3);
    expect(countText('   \n\n  ').paragraphs).toBe(0);
  });

  it('counts sentences at . ! ? … followed by space or end', () => {
    expect(countText('Hello there. Fine, thanks!').sentences).toBe(2);
    expect(countText('Really? Yes…').sentences).toBe(2);
    expect(countText('no punctuation at all').sentences).toBe(1);
    expect(countText('').sentences).toBe(0);
  });

  it('counts characters by Unicode code points', () => {
    expect(countText('café').characters).toBe(4); // precomposed é
    expect(countText('😀').characters).toBe(1);
    expect(countText('😀😀').characters).toBe(2);
  });

  it('treats spaceless scripts as one word per block', () => {
    expect(countText('你好世界').words).toBe(1);
    expect(countText('你好 世界').words).toBe(2);
  });

  it('estimates reading time at 200 wpm with a 1 minute floor', () => {
    expect(countText('word '.repeat(200)).readingMinutes).toBe(1); // 100 words → rounds to 1... actually 0.5 → max(1)
    expect(countText('word '.repeat(400)).readingMinutes).toBe(2);
    expect(countText('word '.repeat(2000)).readingMinutes).toBe(10);
    expect(countText('hello').readingMinutes).toBe(1);
    expect(countText('').readingMinutes).toBe(0);
  });

  it('counts lines', () => {
    expect(countText('a\nb\nc').lines).toBe(3);
    expect(countText('').lines).toBe(0);
  });
});

describe('formatBytes', () => {
  it('formats binary units', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(999)).toBe('999 B');
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(10 * 1024)).toBe('10.0 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    expect(formatBytes(3.2 * 1024 * 1024)).toBe('3.20 MB');
  });

  it('rejects nonsense', () => {
    expect(formatBytes(-1)).toBe('—');
    expect(formatBytes(Number.NaN)).toBe('—');
  });
});

describe('size reduction (measured, never fabricated)', () => {
  it('reports reductions as negative percentages', () => {
    expect(sizeReductionPercent(1000, 400)).toBeCloseTo(60);
    expect(reductionLabel(1000, 400)).toBe('60.0% smaller');
  });

  it('reports growth honestly', () => {
    expect(reductionLabel(1000, 1200)).toBe('20.0% larger');
  });

  it('reports equality', () => {
    expect(reductionLabel(1000, 1000)).toBe('same size');
  });

  it('returns null for unusable inputs', () => {
    expect(reductionLabel(0, 100)).toBeNull();
    expect(reductionLabel(1000, Number.NaN)).toBeNull();
  });
});
