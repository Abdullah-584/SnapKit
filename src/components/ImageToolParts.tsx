import { useEffect, useState } from 'react';
import { Download, FileImage, RotateCcw, X } from 'lucide-react';
import {
  IMAGE_FORMATS,
  MAX_INPUT_BYTES,
  formatLabel,
  supportsEncoding,
  type ImageFormat,
} from '../lib/imageProcessing';
import { formatBytes, reductionLabel } from '../lib/formatters';

interface FileDropzoneProps {
  id?: string;
  onFile: (file: File) => void;
  accept?: string;
  hint?: string;
  disabled?: boolean;
}

/** Accessible drag-and-drop zone wrapping a real file input. */
export function FileDropzone({
  id = 'file-input',
  onFile,
  accept,
  hint,
  disabled = false,
}: FileDropzoneProps) {
  return (
    <label
      htmlFor={id}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        if (disabled) return;
        const file = event.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line-strong bg-surface px-6 py-10 text-center transition-colors hover:border-brand hover:bg-brand-soft/50 ${
        disabled ? 'pointer-events-none opacity-60' : ''
      }`}
    >
      <FileImage className="h-8 w-8 text-brand" aria-hidden="true" />
      <span className="text-sm font-semibold text-ink">
        Choose an image or drop it here
      </span>
      <span className="text-xs text-muted">
        {hint ?? `JPG, PNG or WebP — up to ${formatBytes(MAX_INPUT_BYTES)}`}
      </span>
      <input
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = ''; // allow re-selecting the same file
        }}
      />
    </label>
  );
}

interface FileDetailsProps {
  fileName: string;
  previewUrl: string;
  width?: number;
  height?: number;
  bytes: number;
  mime: string;
  onRemove: () => void;
}

/** Filename, preview, dimensions and original size — plus a remove action. */
export function FileDetails({ fileName, previewUrl, width, height, bytes, mime, onRemove }: FileDetailsProps) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-white">
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
        <div className="flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface sm:w-40">
          {/* eslint-disable-next-line jsx-a11y/alt-text -- preview of the user's own selected file */}
          <img src={previewUrl} alt={`Preview of ${fileName}`} className="max-h-32 w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink" title={fileName}>
            {fileName}
          </p>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted">
            <div className="flex gap-1.5">
              <dt>Size:</dt>
              <dd className="font-medium text-ink-soft">{formatBytes(bytes)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Type:</dt>
              <dd className="font-medium text-ink-soft">{formatLabel(mime as ImageFormat)}</dd>
            </div>
            <div className="flex gap-1.5">
              <dt>Dimensions:</dt>
              <dd className="font-medium text-ink-soft">
                {width && height ? `${width} × ${height} px` : 'reading…'}
              </dd>
            </div>
          </dl>
          <button type="button" className="btn-ghost mt-3 px-2 py-1.5" onClick={onRemove}>
            <X className="h-4 w-4" aria-hidden="true" />
            Remove file
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProcessedResultProps {
  blobUrl: string;
  bytes: number;
  originalBytes: number;
  width: number;
  height: number;
  downloadName: string;
  outputLabel: string;
  onReset: () => void;
}

/** Success state: real output size, real reduction, download and reset. */
export function ProcessedResult({
  blobUrl,
  bytes,
  originalBytes,
  width,
  height,
  downloadName,
  outputLabel,
  onReset,
}: ProcessedResultProps) {
  const reduction = reductionLabel(originalBytes, bytes);
  return (
    <div className="rounded-card border border-success/30 bg-success-soft p-5" role="status">
      <p className="text-sm font-semibold text-success">Done — your file is ready.</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-muted">Output size</dt>
          <dd className="mt-0.5 text-lg font-bold text-ink">{formatBytes(bytes)}</dd>
        </div>
        <div>
          <dt className="text-muted">Change</dt>
          <dd className="mt-0.5 text-lg font-bold text-ink">{reduction ?? '—'}</dd>
        </div>
        <div>
          <dt className="text-muted">Dimensions</dt>
          <dd className="mt-0.5 text-lg font-bold text-ink">
            {width} × {height}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Format</dt>
          <dd className="mt-0.5 text-lg font-bold text-ink">{outputLabel}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">
        Original: {formatBytes(originalBytes)} — figures come from the actual files, not estimates.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={blobUrl} download={downloadName} className="btn-primary">
          <Download className="h-4 w-4" aria-hidden="true" />
          Download {outputLabel}
        </a>
        <button type="button" className="btn-secondary" onClick={onReset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Start over
        </button>
      </div>
    </div>
  );
}

interface QualityControlsProps {
  format: ImageFormat;
  onFormatChange: (format: ImageFormat) => void;
  quality: number;
  onQualityChange: (quality: number) => void;
  /** Formats the user can pick from (input format is preselected). */
  extraNote?: string;
}

/** Output format select + quality slider shared by the image tools. */
export function QualityControls({
  format,
  onFormatChange,
  quality,
  onQualityChange,
  extraNote,
}: QualityControlsProps) {
  const qualityRelevant = format !== 'image/png';

  // Feature-detect encoders after mount: `document` does not exist during
  // prerender, and detection must not differ between server and first render.
  const [encodable, setEncodable] = useState<Record<string, boolean>>({});
  useEffect(() => {
    setEncodable(
      Object.fromEntries(IMAGE_FORMATS.map((candidate) => [candidate.value, supportsEncoding(candidate.value)])),
    );
  }, []);

  return (
    <fieldset className="rounded-card border border-line bg-white p-4">
      <legend className="px-1 text-sm font-semibold text-ink">Output settings</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="output-format" className="label">
            Output format
          </label>
          <select
            id="output-format"
            className="input mt-1.5"
            value={format}
            onChange={(event) => onFormatChange(event.target.value as ImageFormat)}
          >
            {IMAGE_FORMATS.map((candidate) => {
              const supported = encodable[candidate.value] ?? true;
              return (
                <option key={candidate.value} value={candidate.value} disabled={!supported}>
                  {candidate.label}
                  {supported ? '' : ' — not supported by this browser'}
                </option>
              );
            })}
          </select>
          <p className="mt-1.5 text-xs text-muted">{extraNote}</p>
        </div>
        <div>
          <label htmlFor="quality" className="label">
            Quality{' '}
            <span className="font-normal text-muted">
              ({qualityRelevant ? `${Math.round(quality * 100)}%` : 'lossless — no effect'})
            </span>
          </label>
          <input
            id="quality"
            type="range"
            min={10}
            max={100}
            step={5}
            value={Math.round(quality * 100)}
            disabled={!qualityRelevant}
            onChange={(event) => onQualityChange(Number(event.target.value) / 100)}
            className="mt-3 w-full accent-blue-600 disabled:opacity-50"
          />
          <p className="mt-1 text-xs text-muted">
            {qualityRelevant
              ? 'Higher keeps more detail; lower makes a smaller file.'
              : 'PNG is lossless — quality has no effect. Use JPG or WebP for smaller files.'}
          </p>
        </div>
      </div>
    </fieldset>
  );
}
