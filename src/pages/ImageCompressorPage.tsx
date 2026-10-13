import { ImageCompressor } from '../tools/ImageCompressor';
import { ContentSection, FaqSection, NoteBox, StepsSection, ToolPageShell } from '../components/ToolPage';
import { faqJsonLd } from '../lib/seo';

const FAQ = [
  {
    question: 'Is the compression lossless?',
    answer:
      'Only when the output format is PNG, which stores pixels exactly. JPEG and WebP are lossy at any quality below 100% — some detail is discarded to make the file smaller. SnapKit never claims lossless for lossy formats.',
  },
  {
    question: 'Why is my compressed PNG larger than the original?',
    answer:
      'PNG is already a lossless format: if your original PNG was well optimized, re-encoding it cannot shrink it much and can add bytes. Try JPEG or WebP output with the quality slider for a real reduction, or start from a JPEG.',
  },
  {
    question: 'Does my image get uploaded to a server?',
    answer:
      'No. The image is read with the browser\'s file API, drawn to a local canvas and re-encoded in this tab. SnapKit\'s image tools make no network requests with your file.',
  },
  {
    question: 'What quality setting should I use?',
    answer:
      'Around 80% is a good starting point for photos: it is usually visibly close to the original while much smaller. For graphics with flat colours or text, try 60–70% and zoom in to check edges. The tool shows the real size at every setting, so judge by the result.',
  },
  {
    question: 'Can I compress several images at once?',
    answer:
      'Not yet — SnapKit processes one image at a time so memory use stays predictable on phones. Repeat the steps for each file; nothing is stored between runs.',
  },
];

export function ImageCompressorPage() {
  return (
    <ToolPageShell
      crumbs={[{ label: 'Image Tools', to: '/image-tools/' }, { label: 'Image Compressor' }]}
      title="Image Compressor"
      intro="Reduce the file size of JPG, PNG and WebP images without uploading them anywhere. Choose a quality level and an output format, then see the actual size difference — measured, not estimated — before you download."
      jsonLd={[faqJsonLd(FAQ)]}
    >
      <ImageCompressor />

      <StepsSection
        steps={[
          'Choose an image — click the drop zone or drag a JPG, JPEG, PNG or WebP file onto it (up to 30 MB).',
          'Pick the output format. Keep the original, or switch to JPEG/WebP for smaller files. PNG output is always lossless.',
          'Set the quality slider for JPEG and WebP. Higher keeps more detail; lower produces a smaller file.',
          'Press “Compress image”. Decoding and re-encoding happen in this tab — the button shows progress while it works.',
          'Compare the output size and the real reduction, then download the file or start over.',
        ]}
      />

      <ContentSection id="example-heading" title="A real example">
        <p>
          Select a photo, keep the quality at 80%, and press <strong>Compress image</strong>. The
          result card shows two numbers taken from the actual files: the original size and the
          output size. If the original was 3.2 MB and the output is 780 KB, the reduction reads{' '}
          <strong>75.6% smaller</strong> — computed from those two byte counts, never a promised
          ratio.
        </p>
        <p>
          That is the workflow worth repeating: change the quality, compress again, and watch how
          the two numbers move. The best setting is the smallest file whose zoomed-in detail you
          are happy with.
        </p>
      </ContentSection>

      <ContentSection id="formats-heading" title="Supported formats">
        <p>
          <strong>Input:</strong> JPG, JPEG, PNG and WebP files (also matched by extension when the
          browser reports no MIME type).
        </p>
        <p>
          <strong>Output:</strong> JPEG, PNG or WebP. SnapKit feature-detects the encoders your
          browser actually ships; formats your browser cannot encode are disabled instead of
          producing a broken file.
        </p>
        <p>
          <strong>Not supported:</strong> GIF, SVG, HEIC/HEIF, TIFF, AVIF and RAW files. Animated
          formats lose their animation because the tool works on a single still frame.
        </p>
      </ContentSection>

      <ContentSection id="limitations-heading" title="Known limitations">
        <ul>
          <li>
            JPEG and WebP compression is lossy: fine detail changes at every quality level below
            100%.
          </li>
          <li>
            Re-encoding strips metadata (EXIF: camera model, GPS coordinates, timestamps). The
            pixels stay; the metadata does not.
          </li>
          <li>
            The output can occasionally be <em>larger</em> than the input — especially an
            already-optimized PNG. The tool reports the real number either way.
          </li>
          <li>
            Very large images are limited by your device's canvas memory. Files over 30 MB are
            rejected up front, and extremely high-resolution images may fail to decode on phones.
          </li>
          <li>Batch processing and cropping are not part of this tool.</li>
        </ul>
      </ContentSection>

      <NoteBox tone="privacy">
        Your image is decoded and re-encoded entirely in this browser tab. SnapKit does not upload
        the file, and there is no server-side copy to delete. See the{' '}
        <a href="/privacy-policy/" className="font-medium text-brand underline">
          Privacy Policy
        </a>{' '}
        for the full picture (including normal hosting logs for page loads).
      </NoteBox>

      <ContentSection id="troubleshooting-heading" title="Troubleshooting">
        <ul>
          <li>
            <strong>“Not a supported image”:</strong> the file must be JPG, JPEG, PNG or WebP under
            30 MB. HEIC from iPhones and GIF animations are rejected on purpose.
          </li>
          <li>
            <strong>“Could not be decoded”:</strong> the file is likely damaged or truncated — try
            opening it in your photo viewer and re-exporting it.
          </li>
          <li>
            <strong>“Your browser cannot encode …”:</strong> choose a different output format. This
            check prevents a mislabeled download.
          </li>
          <li>
            <strong>Output is bigger than input:</strong> switch the format to JPEG or WebP, or
            lower the quality — see the limitations above.
          </li>
        </ul>
      </ContentSection>

      <FaqSection items={FAQ} />
    </ToolPageShell>
  );
}
