import { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import {
  ACCEPTED_INPUT,
  DEFAULT_QUALITY,
  ImageToolError,
  compressImage,
  defaultOutputFormat,
  formatLabel,
  mayHaveTransparency,
  outputFilename,
  readImageDimensions,
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

/** Image Compressor — real browser-side re-encode with quality control. */
export function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<ImageFormat>('image/jpeg');
  const [quality, setQuality] = useState(DEFAULT_QUALITY);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);

  // Revoke object URLs when they are replaced and on unmount.
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

  async function handleCompress() {
    if (!file || processing) return;
    setProcessing(true);
    setError(null);
    try {
      const output = await compressImage(file, { format, quality });
      if (result) URL.revokeObjectURL(result.url);
      setResult({
        url: URL.createObjectURL(output.blob),
        bytes: output.blob.size,
        width: output.width,
        height: output.height,
        name: outputFilename(file.name, format),
      });
    } catch (err) {
      setError(err instanceof ImageToolError || err instanceof Error ? err.message : 'Compression failed.');
    } finally {
      setProcessing(false);
    }
  }

  const transparencyWarning = file && mayHaveTransparency(file.type) && format === 'image/jpeg';

  return (
    <section aria-label="Image compressor tool" className="card p-5 sm:p-6">
      {!file ? (
        <>
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

          <QualityControls
            format={format}
            onFormatChange={setFormat}
            quality={quality}
            onQualityChange={setQuality}
            extraNote="The original format stays selected; pick another to re-encode."
          />

          {transparencyWarning && (
            <NoteBox tone="warning" title="Transparency will be lost">
              JPEG cannot store transparency — transparent areas become a solid background. Choose
              PNG or WebP as the output format to keep them.
            </NoteBox>
          )}

          {error && <ErrorState title="Could not compress this image" message={error} />}

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={handleCompress} disabled={processing}>
              <Scissors className="h-4 w-4" aria-hidden="true" />
              {processing ? 'Compressing…' : 'Compress image'}
            </button>
            {processing && <LoadingState label="Re-encoding in your browser…" />}
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
        </div>
      )}
    </section>
  );
}
