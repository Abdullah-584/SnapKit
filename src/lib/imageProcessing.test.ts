import { describe, expect, it } from 'vitest';
import {
  ACCEPTED_INPUT,
  DEFAULT_QUALITY,
  MAX_DIMENSION,
  MAX_INPUT_BYTES,
  ImageToolError,
  compressImage,
  convertImage,
  defaultOutputFormat,
  extensionFor,
  isSupportedImageFile,
  mayHaveTransparency,
  mimeFromFilename,
  outputFilename,
  resizeImage,
  supportsEncoding,
  validateDimensions,
  validateImageFile,
} from './imageProcessing';

function makeFile(name: string, type: string, bytes = 100): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe('file validation', () => {
  it('accepts jpg, jpeg, png and webp', () => {
    for (const [name, type] of [
      ['a.jpg', 'image/jpeg'],
      ['a.jpeg', 'image/jpeg'],
      ['a.png', 'image/png'],
      ['a.webp', 'image/webp'],
    ] as const) {
      expect(validateImageFile(makeFile(name, type))).toEqual({ ok: true });
    }
  });

  it('rejects unsupported types by MIME and by extension', () => {
    const gif = makeFile('x.gif', 'image/gif');
    expect(validateImageFile(gif).ok).toBe(false);

    // Empty MIME but a supported extension is still fine.
    expect(isSupportedImageFile({ name: 'photo.JPG', type: '' })).toBe(true); // extension matched case-insensitively
    expect(isSupportedImageFile({ name: 'photo.jpg', type: '' })).toBe(true);
    expect(isSupportedImageFile({ name: 'file.svg', type: 'image/svg+xml' })).toBe(false);
    expect(isSupportedImageFile({ name: 'file.heic', type: '' })).toBe(false);
  });

  it('rejects empty and oversized files', () => {
    expect(validateImageFile(makeFile('e.png', 'image/png', 0)).ok).toBe(false);
    expect(
      validateImageFile(makeFile('big.png', 'image/png', MAX_INPUT_BYTES + 1)).ok,
    ).toBe(false);
  });

  it('accepts files just under the size limit', () => {
    expect(validateImageFile(makeFile('ok.png', 'image/png', MAX_INPUT_BYTES - 1)).ok).toBe(true);
  });
});

describe('dimension validation', () => {
  it('requires positive integers', () => {
    expect(validateDimensions(0, 100).ok).toBe(false);
    expect(validateDimensions(100.5, 100).ok).toBe(false);
    expect(validateDimensions(-5, 100).ok).toBe(false);
    expect(validateDimensions(100, 100).ok).toBe(true);
  });

  it('caps each side and total pixels', () => {
    expect(validateDimensions(MAX_DIMENSION, MAX_DIMENSION).ok).toBe(false);
    expect(validateDimensions(MAX_DIMENSION, 1).ok).toBe(true);
    const result = validateDimensions(8000, 4500); // 36 MP
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/megapixels/);
  });
});

describe('format helpers', () => {
  it('maps extensions to MIME types', () => {
    expect(mimeFromFilename('photo.jpeg')).toBe('image/jpeg');
    expect(mimeFromFilename('photo.png')).toBe('image/png');
    expect(mimeFromFilename('photo.webp')).toBe('image/webp');
    expect(mimeFromFilename('photo.gif')).toBeNull();
  });

  it('names outputs predictably', () => {
    expect(outputFilename('vacation.png', 'image/jpeg')).toBe('vacation-snapkit.jpg');
    expect(outputFilename('noext', 'image/webp')).toBe('noext-snapkit.webp');
  });

  it('knows which formats drop transparency', () => {
    expect(mayHaveTransparency('image/png')).toBe(true);
    expect(mayHaveTransparency('image/webp')).toBe(true);
    expect(mayHaveTransparency('image/jpeg')).toBe(false);
  });

  it('feature-detects encoders instead of assuming', () => {
    // The setup polyfill makes every format "encodable" for testing purposes.
    expect(supportsEncoding('image/png')).toBe(true);
    expect(supportsEncoding('image/webp')).toBe(true);
  });

  it('defaults to the input format when supported', () => {
    expect(defaultOutputFormat('image/png')).toBe('image/png');
    expect(defaultOutputFormat('not-really-an-image')).toBeTruthy();
    expect(['image/jpeg', 'image/png', 'image/webp']).toContain(
      defaultOutputFormat('not-really-an-image'),
    );
  });

  it('exposes the accepted input list for the file picker', () => {
    expect(ACCEPTED_INPUT).toBe('image/jpeg,image/png,image/webp');
    expect(extensionFor('image/jpeg')).toBe('jpg');
  });
});

describe('processing pipeline', () => {
  it('compress reports measured output bytes and original size', async () => {
    const file = makeFile('photo.jpg', 'image/jpeg', 4096);
    const result = await compressImage(file, { format: 'image/jpeg', quality: DEFAULT_QUALITY });
    expect(result.blob.size).toBeGreaterThan(0);
    expect(result.blob.type).toBe('image/jpeg');
    expect(result.originalBytes).toBe(4096);
    expect(result.width).toBe(400); // from the createImageBitmap stub
    expect(result.height).toBe(300);
  });

  it('resizes to exact requested dimensions', async () => {
    const file = makeFile('photo.png', 'image/png');
    const result = await resizeImage(file, {
      format: 'image/png',
      quality: 1,
      width: 1200,
      height: 900,
    });
    expect(result.width).toBe(1200);
    expect(result.height).toBe(900);
    expect(result.blob.type).toBe('image/png');
  });

  it('rejects invalid resize dimensions with a clear error', async () => {
    const file = makeFile('photo.png', 'image/png');
    await expect(
      resizeImage(file, { format: 'image/png', quality: 1, width: 0, height: 100 }),
    ).rejects.toThrow(ImageToolError);
  });

  it('converts to the requested format, preserving declared type', async () => {
    const file = makeFile('shot.png', 'image/png', 2048);
    const result = await convertImage(file, { format: 'image/webp', quality: 0.8 });
    expect(result.blob.type).toBe('image/webp');
    expect(result.format).toBe('image/webp');
  });

  it('lower quality produces smaller files than high quality (mocked encoder, real bookkeeping)', async () => {
    const file = makeFile('photo.jpg', 'image/jpeg');
    const high = await compressImage(file, { format: 'image/jpeg', quality: 0.95 });
    const low = await compressImage(file, { format: 'image/jpeg', quality: 0.2 });
    expect(low.blob.size).toBeLessThan(high.blob.size);
  });
});
