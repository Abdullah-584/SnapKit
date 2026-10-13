import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

/**
 * jsdom ships no canvas backend. These polyfills stand in for the browser
 * primitives SnapKit relies on so tests exercise SnapKit's own logic
 * (validation, state flow, byte bookkeeping) rather than crashing on missing
 * browser APIs. Real encoding is done by the actual browser at runtime.
 */
class FakeCanvasContext {
  imageSmoothingEnabled = false;
  imageSmoothingQuality = 'low';
  drawImage(): void {}
  fillRect(): void {}
}

HTMLCanvasElement.prototype.getContext = function getContext() {
  return new FakeCanvasContext() as unknown as CanvasRenderingContext2D;
} as unknown as typeof HTMLCanvasElement.prototype.getContext;

HTMLCanvasElement.prototype.toDataURL = function toDataURL(type?: string) {
  return `data:${type ?? 'image/png'};base64,FAKE`;
} as typeof HTMLCanvasElement.prototype.toDataURL;

HTMLCanvasElement.prototype.toBlob = function toBlob(
  callback: BlobCallback,
  type = 'image/png',
  quality?: number,
) {
  // Deterministic mock: larger quality → larger payload, like a real encoder.
  const size = 64 + Math.round((quality ?? 1) * 100);
  const bytes = new Uint8Array(size);
  bytes[0] = 1;
  callback(new Blob([bytes], { type }));
} as typeof HTMLCanvasElement.prototype.toBlob;

// Image decoding: jsdom has neither createImageBitmap nor object URLs.
Object.defineProperty(globalThis, 'createImageBitmap', {
  configurable: true,
  writable: true,
  value: async () => ({ width: 400, height: 300, close: () => {} }),
});

let urlCounter = 0;
Object.defineProperty(URL, 'createObjectURL', {
  configurable: true,
  writable: true,
  value: () => `blob:mock-${++urlCounter}`,
});
Object.defineProperty(URL, 'revokeObjectURL', {
  configurable: true,
  writable: true,
  value: () => {},
});

// jsdom does not implement scrolling.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  document.head.innerHTML = '';
  document.title = '';
});
