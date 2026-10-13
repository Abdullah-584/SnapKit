import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Scaling } from 'lucide-react';
import {
  ACCEPTED_INPUT,
  DEFAULT_QUALITY,
  ImageToolError,
  MAX_DIMENSION,
  defaultOutputFormat,
  formatLabel,
  outputFilename,
  readImageDimensions,
  resizeImage,
  validateDimensions,
  validateImageFile,
  type ImageFormat,
} from '../lib/imageProcessing';
import { ErrorState, LoadingState } from '../components/States';
import { NoteBox } from '../components/ToolPage';
import { FileDetails, FileDropzone, ProcessedResult, QualityControls } from '../components/ImageToolParts';

interface ResultState {
  url: string;
  bytes: number;
  width: number;
  height: number;
  name: string;
}

/** Image Resizer — pixel and percentage resizing with aspect-ratio lock. */
export function ImageResizer() {
  const [searchParams] = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  const [mode, setMode] = useState<'px' | 'percent'>('px');
  const [lock, setLock] = useState(true);
  const [percent, setPercent] = useState(100);
  const [targetW, setTargetW] = useState(0);
  const [targetH, setTargetH] = useState(0);

  // Read ?width= &height= preset (used by the Social Image Size Guide).
  const preset = (() => {
    const w = Number(searchParams.get('width'));
    const h = Number(searchParams.get('height'));
    if (Number.isInteger(w) && Number.isInteger(h) && w > 0 && h > 0 && w <= MAX_DIMENSION && h <= MAX_DIMENSION) {
      return { width: w, height: h };
    }
    return null;
  })();

  useEffect(() => {
    if (preset) {
      setMode('px');
      setLock(true);
      setTargetW(preset.width);
      setTargetH(preset.height);
    }
    // Only apply when the URL preset changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset?.width, preset?.height]);

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
    setFormat(defaultOutputFormat(next.type));
    setMode('px');
    setPercent(100);
    readImageDimensions(next)
      .then(({ width, height }) => {
        setDims({ width, height });
        if (!preset) {
          setTargetW(width);
          setTargetH(height);
        }
      })
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

  function updateWidth(next: number) {
    setTargetW(next);
    if (lock && dims) setTargetH(Math.max(1, Math.round(next / (dims.width / dims.height))));
  }

  function updateHeight(next: number) {
    setTargetH(next);
    if (lock && dims) setTargetW(Math.max(1, Math.round(next * (dims.width / dims.height))));
  }

  function updatePercent(next: number) {
    setPercent(next);
    if (dims) {
      setTargetW(Math.max(1, Math.round((dims.width * next) / 100)));
      setTargetH(Math.max(1, Math.round((dims.height * next) / 100)));
    }
  }

  async function handleResize() {
    if (!file || processing) return;
    const validation = validateDimensions(targetW, targetH);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }
    setProcessing(true);
    setError(null);
    try {
      const output = await resizeImage(file, { format, quality, width: targetW, height: targetH });
      if (result) URL.revokeObjectURL(result.url);
      setResult({
        url: URL.createObjectURL(output.blob),
        bytes: output.blob.size,
        width: output.width,
        height: output.height,
        name: outputFilename(file.name, format),
      });
    } catch (err) {
      setError(err instanceof ImageToolError || err instanceof Error ? err.message : 'Resize failed.');
    } finally {
      setProcessing(false);
    }
  }

  const upscaling = Boolean(dims && (targetW > dims.width || targetH > dims.height));
  const presetNote = preset ? `Preset applied: ${preset.width} × ${preset.height} px (from the size guide).` : null;

  return (
    <section aria-label="Image resizer tool" className="card p-5 sm:p-6">
      {!file ? (
        <>
          {presetNote && (
            <p className="mb-3 text-sm text-brand" role="status">
              {presetNote} Choose an image to resize it to these dimensions.
            </p>
          )}
          <FileDropzone onFile={handleFile} accept={ACCEPTED_INPUT} />
          {error && <ErrorState title="Could not read that file" message={error} />}
        </>
      ) : (
        <div className="space-y-4">
          <FileDetails
            fileName={file.name}
            previewUrl={previewUrl ?? ''}
            width={dims?.width}
            height={dims?.height}
            bytes={file.size}
            mime={file.type || 'image/jpeg'}
            onRemove={clearFile}
          />

          <fieldset className="rounded-card border border-line bg-white p-4">
            <legend className="px-1 text-sm font-semibold text-ink">Resize settings</legend>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Resize mode">
              <button
                type="button"
                className={mode === 'px' ? 'btn-primary' : 'btn-secondary'}
                aria-pressed={mode === 'px'}
                onClick={() => setMode('px')}
              >
                Pixels
              </button>
              <button
                type="button"
                className={mode === 'percent' ? 'btn-primary' : 'btn-secondary'}
                aria-pressed={mode === 'percent'}
                onClick={() => setMode('percent')}
              >
                Percentage
              </button>
            </div>

            {mode === 'px' ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                <div>
                  <label htmlFor="target-width" className="label">
                    Width (px)
                  </label>
                  <input
                    id="target-width"
                    type="number"
                    min={1}
                    max={MAX_DIMENSION}
                    className="input mt-1.5"
                    value={targetW || ''}
                    onChange={(event) => updateWidth(Number(event.target.value))}
                  />
                </div>
                <button
                  type="button"
                  className={`btn-secondary mb-0.5 sm:mb-0 ${lock ? 'border-brand text-brand' : ''}`}
                  aria-pressed={lock}
                  onClick={() => setLock((value) => !value)}
                  title={lock ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                >
                  {lock ? 'Linked 🔗' : 'Unlinked'}
                </button>
                <div>
                  <label htmlFor="target-height" className="label">
                    Height (px)
                  </label>
                  <input
                    id="target-height"
                    type="number"
                    min={1}
                    max={MAX_DIMENSION}
                    className="input mt-1.5"
                    value={targetH || ''}
                    onChange={(event) => updateHeight(Number(event.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <label htmlFor="target-percent" className="label">
                  Scale: <span className="font-normal text-muted">{percent}% of the original</span>
                </label>
                <input
                  id="target-percent"
                  type="range"
                  min={1}
                  max={500}
                  step={1}
                  value={percent}
                  onChange={(event) => updatePercent(Number(event.target.value))}
                  className="mt-3 w-full accent-blue-600"
                />
                <p className="mt-1 text-sm text-muted">
                  Result: <strong className="text-ink-soft">{targetW} × {targetH} px</strong>
                  {dims ? ` (original ${dims.width} × ${dims.height})` : ''}
                </p>
              </div>
            )}

            <p className="mt-3 text-sm text-muted">
              {lock
                ? 'Aspect ratio locked — changing one side keeps proportions.'
                : 'Aspect ratio unlocked — sides change independently and may stretch the image.'}
              {dims ? ` Original: ${dims.width} × ${dims.height} px.` : ''}
            </p>
          </fieldset>

          <QualityControls
            format={format}
            onFormatChange={setFormat}
            quality={quality}
            onQualityChange={setQuality}
            extraNote="Resizing re-encodes the image in the selected format."
          />

          {upscaling && (
            <NoteBox tone="info" title="You are enlarging this image">
              Bigger pixels are not more detail — enlarging can look soft or blocky. If you need
              more detail, start from a larger original.
            </NoteBox>
          )}

          {error && <ErrorState title="Could not resize this image" message={error} />}

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={handleResize} disabled={processing}>
              <Scaling className="h-4 w-4" aria-hidden="true" />
              {processing ? 'Resizing…' : `Resize to ${targetW} × ${targetH}`}
            </button>
            {processing && <LoadingState label="Resizing in your browser…" />}
          </div>

          {result && (
            <ProcessedResult
              blobUrl={result.url}
              bytes={result.bytes}
              originalBytes={file.size}
              width={result.width}
              height={result.height}
              downloadName={result.name}
              outputLabel={formatLabel(format)}
              onReset={clearFile}
            />
          )}

          <NoteBox tone="info" title="Quality note">
            Changing pixel dimensions discards information, and lossy formats (JPEG, WebP) re-encode
            on every save. Compare the result at 100% zoom before publishing if quality matters.
          </NoteBox>
        </div>
      )}
    </section>
  );
}
