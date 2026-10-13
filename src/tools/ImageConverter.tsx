import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  ACCEPTED_INPUT,
  DEFAULT_QUALITY,
  ImageToolError,
  UnsupportedEncodingError,
  convertImage,
  defaultOutputFormat,
  formatLabel,
  mayHaveTransparency,
  outputFilename,
  readImageDimensions,
  supportsEncoding,
  validateImageFile,
  type ImageFormat,
} from '../lib/imageProcessing';
import { formatBytes, reductionLabel } from '../lib/formatters';
import { ErrorState, LoadingState } from '../components/States';
import { NoteBox } from '../components/ToolPage';
import { FileDetails, FileDropzone, QualityControls } from '../components/ImageToolParts';

interface ResultState {
  url: string;
  bytes: number;
  width: number;
  height: number;
  name: string;
  format: ImageFormat;
}

function pickDefaultTarget(sourceType: string): ImageFormat {
  const source = defaultOutputFormat(sourceType, 'image/jpeg');
  const candidates: ImageFormat[] = ['image/webp', 'image/png', 'image/jpeg'];
  return candidates.find((candidate) => candidate !== source && supportsEncoding(candidate)) ?? source;
}

/** Image Format Converter — JPEG ⇄ PNG ⇄ WebP with transparency handling. */
export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);
  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  function handleFile(next: File) {
    const validation = validateImageFile(next);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }
    setError(null);
    if (result) URL.revokeObjectURL(result.url);
    setResult(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(next);
    setPreviewUrl(url);
    setFile(next);
    setDims(null);
    setFormat(pickDefaultTarget(next.type));
    setQuality(DEFAULT_QUALITY);
    readImageDimensions(next)
      .then(setDims)
      .catch(() => setDims(null));
  }

  function clearFile() {
    if (result) URL.revokeObjectURL(result.url);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setResult(null);
    setPreviewUrl(null);
    setFile(null);
    setDims(null);
    setError(null);
  }

  async function handleConvert() {
    if (!file || processing) return;
    if (!supportsEncoding(format)) {
      setError(
        `Your browser cannot encode ${formatLabel(format)} files, so the download would be broken. Choose another format.`,
      );
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const output = await convertImage(file, { format, quality });
      if (result) URL.revokeObjectURL(result.url);
      setResult({
        url: URL.createObjectURL(output.blob),
        bytes: output.blob.size,
        width: output.width,
        height: output.height,
        name: outputFilename(file.name, format),
        format,
      });
    } catch (err) {
      if (err instanceof UnsupportedEncodingError) {
        setError(err.message);
      } else if (err instanceof ImageToolError || err instanceof Error) {
        setError(err.message);
      } else {
        setError('Conversion failed.');
      }
    } finally {
      setProcessing(false);
    }
  }

  const sourceFormat = file ? defaultOutputFormat(file.type, 'image/jpeg') : null;
  const losesAlpha = Boolean(file && mayHaveTransparency(file.type) && format === 'image/jpeg');
  const sameFormat = Boolean(sourceFormat && sourceFormat === format);

  return (
    <section aria-label="Image format converter tool" className="card p-5 sm:p-6">
      {!file ? (
        <>
          <FileDropzone onFile={handleFile} accept={ACCEPTED_INPUT} />
          {error && <ErrorState title="Could not read that file" message={error} />}
        </>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <FileDetails
              fileName={file.name}
              previewUrl={previewUrl ?? ''}
              width={dims?.width}
              height={dims?.height}
              bytes={file.size}
              mime={(sourceFormat ?? file.type) || 'image/jpeg'}
              onRemove={clearFile}
            />
            {result ? (
              <div className="overflow-hidden rounded-card border border-success/30 bg-success-soft p-4">
                <p className="text-sm font-semibold text-success">Converted output</p>
                <div className="mt-2 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img
                    src={result.url}
                    alt="Preview of the converted image"
                    className="max-h-32 w-full object-contain"
                  />
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex gap-1.5">
                    <dt className="text-muted">Format:</dt>
                    <dd className="font-medium text-ink-soft">{formatLabel(result.format)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted">Size:</dt>
                    <dd className="font-medium text-ink-soft">{formatBytes(result.bytes)}</dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted">Change:</dt>
                    <dd className="font-medium text-ink-soft">
                      {reductionLabel(file.size, result.bytes) ?? '—'}
                    </dd>
                  </div>
                  <div className="flex gap-1.5">
                    <dt className="text-muted">Dimensions:</dt>
                    <dd className="font-medium text-ink-soft">
                      {result.width} × {result.height}
                    </dd>
                  </div>
                </dl>
                <a href={result.url} download={result.name} className="btn-primary mt-4">
                  Download {formatLabel(result.format)}
                </a>
              </div>
            ) : (
              <div className="flex flex-col justify-center rounded-card border border-dashed border-line-strong bg-surface p-4 text-sm text-muted">
                <p className="font-semibold text-ink">Output preview</p>
                <p className="mt-1.5">
                  Choose an output format and press <strong>Convert image</strong> — the converted
                  file appears here with its real size.
                </p>
              </div>
            )}
          </div>

          <QualityControls
            format={format}
            onFormatChange={(next) => {
              setFormat(next);
              setError(null);
            }}
            quality={quality}
            onQualityChange={setQuality}
            extraNote="Only formats your browser can actually encode are selectable."
          />

          {losesAlpha && (
            <NoteBox tone="warning" title="JPEG removes transparency">
              JPEG has no alpha channel, so transparent areas will be filled with a solid background
              colour. Choose PNG or WebP to keep transparency.
            </NoteBox>
          )}

          {sameFormat && (
            <NoteBox tone="info" title="Same format selected">
              Input and output are both {formatLabel(format)} — the file will be re-encoded at the
              quality you set, which changes the bytes (and, for lossy formats, the quality).
            </NoteBox>
          )}

          {error && <ErrorState title="Could not convert this image" message={error} />}

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={handleConvert} disabled={processing}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {processing ? 'Converting…' : `Convert to ${formatLabel(format)}`}
            </button>
            {processing && <LoadingState label="Converting in your browser…" />}
            {result && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (result) URL.revokeObjectURL(result.url);
                  setResult(null);
                }}
              >
                Clear result
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
