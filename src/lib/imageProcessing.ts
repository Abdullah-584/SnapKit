/**
 * Browser-side image processing.
 *
 * All functions operate on data the user selected locally: files are decoded,
 * drawn to a canvas and re-encoded with the browser's own encoders. Nothing in
 * this module performs network I/O.
 *
 * Browser support is detected at runtime (see `supportsEncoding`) instead of
 * assumed, so unsupported encoders surface as errors rather than mislabeled
 * files.
 */

export type ImageFormat = 'image/jpeg' | 'image/png' | 'image/webp';

export const IMAGE_FORMATS: { value: ImageFormat; label: string; extension: string; supportsAlpha: boolean }[] = [
  { value: 'image/jpeg', label: 'JPEG', extension: 'jpg', supportsAlpha: false },
  { value: 'image/png', label: 'PNG', extension: 'png', supportsAlpha: true },
  { value: 'image/webp', label: 'WebP', extension: 'webp', supportsAlpha: true },
];

export const ACCEPTED_MIME_TYPES: string[] = IMAGE_FORMATS.map((f) => f.value);
export const ACCEPTED_INPUT = ACCEPTED_MIME_TYPES.join(',');
export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

/** 30 MB — large enough for phone photos, small enough to avoid canvas memory issues. */
export const MAX_INPUT_BYTES = 30 * 1024 * 1024;
/** Per-side output cap; most browsers fail above ~16384 px. */
export const MAX_DIMENSION = 8000;
/** Total-pixel cap to keep canvas memory sane on phones (32 MP). */
export const MAX_PIXELS = 32_000_000;

export class ImageToolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageToolError';
  }
}

export class UnsupportedEncodingError extends ImageToolError {
  constructor(format: ImageFormat) {
    super(
      `Your browser cannot encode ${formatLabel(format)} files. Choose a different output format.`,
    );
    this.name = 'UnsupportedEncodingError';
  }
}

export type ValidationResult = { ok: true } | { ok: false; message: string };

export function formatLabel(format: ImageFormat): string {
  return IMAGE_FORMATS.find((f) => f.value === format)?.label ?? format;
}

export function extensionFor(format: ImageFormat): string {
  return IMAGE_FORMATS.find((f) => f.value === format)?.extension ?? 'bin';
}

export function supportsAlpha(format: ImageFormat): boolean {
  return IMAGE_FORMATS.find((f) => f.value === format)?.supportsAlpha ?? false;
}

const EXTENSION_MIME: Record<string, ImageFormat> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export function mimeFromFilename(name: string): ImageFormat | null {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXTENSION_MIME[ext] ?? null;
}

/** True when the file's type (or extension, for empty MIME types) is supported. */
export function isSupportedImageFile(file: { name: string; type: string }): boolean {
  const byType = ACCEPTED_MIME_TYPES.includes(file.type);
  const byExtension = file.type === '' && mimeFromFilename(file.name) !== null;
  return byType || byExtension;
}

/** Validate a user-selected file before any decoding happens. */
export function validateImageFile(file: File): ValidationResult {
  if (file.size === 0) {
    return { ok: false, message: `"${file.name}" is empty (0 bytes). Choose a valid image file.` };
  }
  if (!isSupportedImageFile(file)) {
    return {
      ok: false,
      message: `"${file.name}" is not a supported image. Use JPG, JPEG, PNG or WebP.`,
    };
  }
  if (file.size > MAX_INPUT_BYTES) {
    return {
      ok: false,
      message: `"${file.name}" is larger than the ${Math.round(MAX_INPUT_BYTES / (1024 * 1024))} MB limit. Try a smaller file.`,
    };
  }
  return { ok: true };
}

/** Validate output dimensions before drawing. */
export function validateDimensions(width: number, height: number): ValidationResult {
  if (!Number.isInteger(width) || !Number.isInteger(height) || width <= 0 || height <= 0) {
    return { ok: false, message: 'Width and height must be positive whole numbers of pixels.' };
  }
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    return {
      ok: false,
      message: `Each side must be at most ${MAX_DIMENSION} px (requested ${width} × ${height}).`,
    };
  }
  if (width * height > MAX_PIXELS) {
    return {
      ok: false,
      message: `Output would be ${(width * height) / 1_000_000} megapixels; the limit is ${MAX_PIXELS / 1_000_000} MP.`,
    };
  }
  return { ok: true };
}

/**
 * Feature-detect whether the current browser can encode the given format.
 * Uses `canvas.toDataURL` on a 1×1 canvas, which reports `data:null` for
 * unsupported types.
 */
export function supportsEncoding(format: ImageFormat): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const url = canvas.toDataURL(format);
    return !url.startsWith('data:,') && url.startsWith(`data:${format}`);
  } catch {
    return false;
  }
}

export interface DecodedImage {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

/** Decode a File into a canvas via createImageBitmap (fallback: <img>). */
export async function decodeImage(file: File): Promise<HTMLCanvasElement> {
  let source: ImageBitmap | HTMLImageElement;
  let url: string | null = null;

  if (typeof createImageBitmap === 'function') {
    try {
      source = await createImageBitmap(file);
    } catch (err) {
      throw new ImageToolError(
        `"${file.name}" could not be decoded. The file may be damaged or use an unsupported variant of the format.`,
      );
    }
  } else {
    url = URL.createObjectURL(file);
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new ImageToolError(`"${file.name}" could not be decoded.`));
      img.src = url as string;
    });
  }

  const width = 'width' in source ? source.width : 0;
  const height = 'height' in source ? source.height : 0;
  if (!width || !height) {
    if (source instanceof HTMLImageElement && url) URL.revokeObjectURL(url);
    throw new ImageToolError(`"${file.name}" has no readable pixel dimensions.`);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    if (source instanceof HTMLImageElement && url) URL.revokeObjectURL(url);
    throw new ImageToolError('Your browser could not create a 2D canvas context.');
  }
  ctx.drawImage(source, 0, 0);
  if ('close' in source && typeof source.close === 'function') source.close();
  if (url) URL.revokeObjectURL(url);
  return canvas;
}

/** Re-draw a canvas at new dimensions with high-quality smoothing. */
export function drawScaled(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = width;
  out.height = height;
  const ctx = out.getContext('2d');
  if (!ctx) throw new ImageToolError('Your browser could not create a 2D canvas context.');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(canvas, 0, 0, width, height);
  return out;
}

/** Encode a canvas, throwing a clear error when the encoder is unavailable. */
export function encodeImage(
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality = 0.8,
): Promise<Blob> {
  if (!supportsEncoding(format)) {
    return Promise.reject(new UnsupportedEncodingError(format));
  }
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.size === 0) {
          reject(new ImageToolError(`Encoding to ${formatLabel(format)} produced no data.`));
          return;
        }
        resolve(blob);
      },
      format,
      quality,
    );
  });
}

export interface ProcessOptions {
  format: ImageFormat;
  /** 0–1; only meaningful for JPEG and WebP (PNG encoding is lossless). */
  quality: number;
}

/** Read a file's pixel dimensions without decoding it into a canvas. */
export async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file);
      const dims = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return dims;
    } catch {
      // fall through to the <img> path
    }
  }
  const url = URL.createObjectURL(file);
  try {
    return await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new ImageToolError(`"${file.name}" could not be decoded.`));
      img.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
  format: ImageFormat;
  originalBytes: number;
}

export const DEFAULT_QUALITY = 0.8;

/** Lossy re-encode at the original dimensions. */
export async function compressImage(file: File, options: ProcessOptions): Promise<ProcessResult> {
  const canvas = await decodeImage(file);
  const blob = await encodeImage(canvas, options.format, options.quality);
  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    format: options.format,
    originalBytes: file.size,
  };
}

/** Resize to exact pixel dimensions, then re-encode. */
export async function resizeImage(
  file: File,
  options: ProcessOptions & { width: number; height: number },
): Promise<ProcessResult> {
  const dims = validateDimensions(options.width, options.height);
  if (!dims.ok) throw new ImageToolError(dims.message);
  const canvas = await decodeImage(file);
  const scaled = canvas.width === options.width && canvas.height === options.height
    ? canvas
    : drawScaled(canvas, options.width, options.height);
  const blob = await encodeImage(scaled, options.format, options.quality);
  return {
    blob,
    width: scaled.width,
    height: scaled.height,
    format: options.format,
    originalBytes: file.size,
  };
}

/** Convert to another format at the original dimensions. */
export async function convertImage(file: File, options: ProcessOptions): Promise<ProcessResult> {
  const canvas = await decodeImage(file);
  const blob = await encodeImage(canvas, options.format, options.quality);
  return {
    blob,
    width: canvas.width,
    height: canvas.height,
    format: options.format,
    originalBytes: file.size,
  };
}

/**
 * Whether the source may carry transparency (used to warn before a JPEG
 * export). PNG and WebP can hold an alpha channel; JPEG never can.
 */
export function mayHaveTransparency(sourceMime: string): boolean {
  return sourceMime === 'image/png' || sourceMime === 'image/webp';
}

/** Build `name-snapkit.ext` style output names. */
export function outputFilename(originalName: string, format: ImageFormat): string {
  const base = originalName.replace(/\.[^.]+$/, '') || 'image';
  return `${base}-snapkit.${extensionFor(format)}`;
}

/** Pick a sensible default output format: keep the input format unless unsupported. */
export function defaultOutputFormat(sourceMime: string, fallback: ImageFormat = 'image/jpeg'): ImageFormat {
  const known = (Object.keys(EXTENSION_MIME) as (keyof typeof EXTENSION_MIME)[]).find(
    (ext) => EXTENSION_MIME[ext] === sourceMime,
  );
  const resolved = known ? EXTENSION_MIME[known] : null;
  if (resolved && supportsEncoding(resolved)) return resolved;
  return IMAGE_FORMATS.map((f) => f.value).find((f) => supportsEncoding(f)) ?? fallback;
}
