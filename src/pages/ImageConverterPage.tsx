import { ImageConverter } from '../tools/ImageConverter';
import { ContentSection, FaqSection, NoteBox, StepsSection, ToolPageShell } from '../components/ToolPage';
import { faqJsonLd } from '../lib/seo';

const FAQ = [
  {
    question: 'Which format should I convert to?',
    answer:
      'WebP is a good default for photos and web graphics — usually smaller than JPEG at similar quality, with transparency support. Keep PNG when you need guaranteed lossless pixels (screenshots with text, logos). Use JPEG for maximum compatibility with older tools.',
  },
  {
    question: 'Will transparency survive the conversion?',
    answer:
      'PNG and WebP keep an alpha channel; JPEG does not, so converting to JPEG fills transparent areas with a solid colour. SnapKit warns you before a JPEG conversion when the source may contain transparency.',
  },
  {
    question: 'What if my browser cannot encode the format I picked?',
    answer:
      'The format is disabled in the list, and if encoding still fails the tool reports the error instead of downloading a mislabeled file. All supported formats are feature-detected in your browser at runtime.',
  },
  {
    question: 'Does converting change the image size in pixels?',
    answer:
      'No. Dimensions stay identical — only the encoding and file format change. Use the Image Resizer if you also need different dimensions.',
  },
  {
    question: 'Is any data sent when I convert?',
    answer:
      'No. Decoding and encoding happen in this browser tab with the canvas API. The tool performs no network requests with your file.',
  },
];

export function ImageConverterPage() {
  return (
    <ToolPageShell
      crumbs={[{ label: 'Image Tools', to: '/image-tools/' }, { label: 'Image Format Converter' }]}
      title="Image Format Converter"
      intro="Convert images between JPEG, PNG and WebP directly in your browser. Transparency is kept where the format supports it, warned about where it does not, and encoders your browser lacks are detected instead of producing broken files."
      jsonLd={[faqJsonLd(FAQ)]}
    >
      <ImageConverter />

      <StepsSection
        steps={[
          'Choose a JPG, JPEG, PNG or WebP file. Its format, size and dimensions appear as the source information.',
          'Pick the target format — formats your browser cannot encode are disabled automatically.',
          'Adjust quality for lossy targets (JPEG, WebP). PNG output is always lossless, so the slider is disabled for it.',
          'Press “Convert image”. The output panel shows a preview plus the real file size and change.',
          'Download the converted file, or clear the result to try another format from the same source.',
        ]}
      />

      <ContentSection id="example-heading" title="A real example">
        <p>
          A screenshot saved as PNG might be 1.4 MB. Convert it to WebP at 85% quality and the
          result card shows the measured output — often a few hundred KB — with the exact
          percentage change calculated from the two byte counts.
        </p>
        <p>
          Now convert a logo with transparent corners from PNG to JPEG: SnapKit shows the
          transparency warning first, and after conversion the preview reveals the transparent
          areas filled with a solid background. That is the difference the warning exists for.
        </p>
      </ContentSection>

      <ContentSection id="formats-heading" title="Format comparison">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-sm">
            <caption className="sr-only">JPEG, PNG and WebP characteristics</caption>
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                <th scope="col" className="py-2 pr-4 font-semibold">Format</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Compression</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Transparency</th>
                <th scope="col" className="py-2 font-semibold">Best for</th>
              </tr>
            </thead>
            <tbody className="text-ink-soft">
              <tr className="border-b border-line">
                <th scope="row" className="py-2.5 pr-4 text-left font-semibold text-ink">JPEG</th>
                <td className="py-2.5 pr-4">Lossy</td>
                <td className="py-2.5 pr-4">No</td>
                <td className="py-2.5">Photos where small size matters most</td>
              </tr>
              <tr className="border-b border-line">
                <th scope="row" className="py-2.5 pr-4 text-left font-semibold text-ink">PNG</th>
                <td className="py-2.5 pr-4">Lossless</td>
                <td className="py-2.5 pr-4">Yes</td>
                <td className="py-2.5">Screenshots, logos, line art, transparency</td>
              </tr>
              <tr>
                <th scope="row" className="py-2.5 pr-4 text-left font-semibold text-ink">WebP</th>
                <td className="py-2.5 pr-4">Lossy or lossless</td>
                <td className="py-2.5 pr-4">Yes</td>
                <td className="py-2.5">Web images — usually smaller than JPEG</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Inputs: JPG, JPEG, PNG, WebP. Outputs: JPEG, PNG, WebP, subject to browser encoder
          support. AVIF, GIF and HEIC are not part of this tool.
        </p>
      </ContentSection>

      <ContentSection id="limitations-heading" title="Known limitations">
        <ul>
          <li>Only formats your browser can encode are offered — support is detected, not assumed.</li>
          <li>Metadata (EXIF) is stripped during conversion.</li>
          <li>
            Animated GIF/WebP become still images: the browser canvas encodes a single frame.
          </li>
          <li>
            Converting between lossy formats (JPEG → WebP) re-encodes already-compressed pixels —
            quality drops slightly with each lossy hop.
          </li>
          <li>Dimensions never change here; use the Image Resizer for that.</li>
        </ul>
      </ContentSection>

      <NoteBox tone="privacy">
        Conversion is 100% local: the file is decoded and encoded in this tab. Nothing is uploaded
        to any server by this tool.
      </NoteBox>

      <ContentSection id="troubleshooting-heading" title="Troubleshooting">
        <ul>
          <li>
            <strong>Format is greyed out:</strong> your browser does not ship that encoder (rare on
            current browsers). Choose another target.
          </li>
          <li>
            <strong>“Encoding produced no data”:</strong> the encoder failed for this file — try a
            different output format.
          </li>
          <li>
            <strong>Colours look slightly different:</strong> converting JPEG → PNG cannot restore
            detail the JPEG already discarded; the pixels are copied as-is.
          </li>
          <li>
            <strong>Transparent areas turned white:</strong> that is JPEG behaviour — convert to
            PNG or WebP instead.
          </li>
        </ul>
      </ContentSection>

      <FaqSection items={FAQ} />
    </ToolPageShell>
  );
}
