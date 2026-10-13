import { ImageResizer } from '../tools/ImageResizer';
import { ContentSection, FaqSection, NoteBox, StepsSection, ToolPageShell } from '../components/ToolPage';
import { faqJsonLd } from '../lib/seo';

const FAQ = [
  {
    question: 'Will resizing make my image blurry?',
    answer:
      'Downscaling usually looks fine — browsers use smooth scaling when they redraw the pixels. Enlarging cannot invent detail, so it can look soft or blocky. Whenever you need more detail, start from a larger original.',
  },
  {
    question: 'What does the link icon between width and height do?',
    answer:
      'It locks the aspect ratio. With the lock on, typing a width recalculates the height automatically so the picture is never stretched. Turn it off only when you deliberately want unusual dimensions.',
  },
  {
    question: 'Can I resize by percentage instead of pixels?',
    answer:
      'Yes — switch to the Percentage mode and use the slider (1–500%). The exact pixel result is shown live, and the same validation and download flow applies.',
  },
  {
    question: 'Does SnapKit crop images?',
    answer:
      'No. This tool changes dimensions only — it scales the whole picture. If you need to cut parts away, crop first in an editor and then resize here.',
  },
  {
    question: 'Is there a maximum output size?',
    answer:
      'Each side may be up to 8000 px and the total output is capped at 32 megapixels, which keeps the browser canvas reliable on phones as well as desktops.',
  },
];

export function ImageResizerPage() {
  return (
    <ToolPageShell
      crumbs={[{ label: 'Image Tools', to: '/image-tools/' }, { label: 'Image Resizer' }]}
      title="Image Resizer"
      intro="Resize any photo to exact pixel dimensions or by percentage, with an aspect-ratio lock that prevents stretching. Preview the target size, then download the resized file — everything happens in your browser."
      jsonLd={[faqJsonLd(FAQ)]}
    >
      <ImageResizer />

      <StepsSection
        steps={[
          'Choose a JPG, JPEG, PNG or WebP image (up to 30 MB). Its dimensions are read and shown immediately.',
          'Switch to Pixels mode and type a width or height — with the lock on, the other side follows automatically. Or use Percentage mode to scale the whole image.',
          'Choose the output format and quality. PNG stays lossless; JPEG and WebP use the quality slider.',
          'Press “Resize to …” and check the result card: real output size, real change, exact dimensions.',
          'Download the file, or press “Start over” to resize the same image again with different settings.',
        ]}
      />

      <ContentSection id="example-heading" title="A real example">
        <p>
          You have a 4032 × 3024 holiday photo and want it 1200 px wide for a blog post. Choose the
          file, type <strong>1200</strong> in the width field, and leave the lock on: the height
          becomes <strong>900 px</strong> (4032 ÷ 3024 = 1.333, so 1200 ÷ 1.333 = 900). Press
          resize, and the result card reports the exact output bytes and how they compare with the
          original file.
        </p>
        <p>
          Coming from the Social Image Size Guide? Links like{' '}
          <code>/image-resizer/?width=1080&amp;height=1350</code> open this tool with the preset
          dimensions already filled in.
        </p>
      </ContentSection>

      <ContentSection id="formats-heading" title="Supported formats">
        <p>
          <strong>Input:</strong> JPG, JPEG, PNG and WebP.
        </p>
        <p>
          <strong>Output:</strong> JPEG, PNG or WebP — only encoders your browser supports are
          selectable. Transparent sources should keep PNG or WebP output; JPEG has no transparency.
        </p>
        <p>
          <strong>Limits:</strong> integer pixel values from 1 to 8000 px per side, up to 32 MP in
          total; percentage scaling from 1% to 500%.
        </p>
      </ContentSection>

      <ContentSection id="limitations-heading" title="Known limitations">
        <ul>
          <li>Resizing changes pixel counts — it does not crop, rotate or add detail.</li>
          <li>
            Every save re-encodes the image. For JPEG and WebP that is lossy, so repeated
            resize-and-save cycles gradually soften the picture.
          </li>
          <li>Metadata (EXIF) is dropped during re-encoding.</li>
          <li>
            Unlocking the aspect ratio allows stretching on purpose; the tool warns you while the
            ratio is unlocked.
          </li>
        </ul>
      </ContentSection>

      <NoteBox tone="privacy" title="Privacy: local processing">
        The chosen file is read and redrawn inside this tab with the browser's canvas API. No image
        data is sent to SnapKit or any third party by this tool.
      </NoteBox>

      <ContentSection id="troubleshooting-heading" title="Troubleshooting">
        <ul>
          <li>
            <strong>“must be at most 8000 px” / “megapixels limit”:</strong> your requested output
            is above the safe canvas size — pick smaller dimensions.
          </li>
          <li>
            <strong>The picture looks stretched:</strong> re-enable the aspect-ratio lock and set
            the correct side first; the tool recalculates the other.
          </li>
          <li>
            <strong>Blurry result:</strong> you enlarged the image. Reduce the target size or use a
            larger original.
          </li>
          <li>
            <strong>File not accepted:</strong> only JPG, JPEG, PNG and WebP up to 30 MB are
            supported.
          </li>
        </ul>
      </ContentSection>

      <FaqSection items={FAQ} />
    </ToolPageShell>
  );
}
