import { WordCounter } from '../tools/WordCounter';
import { ContentSection, FaqSection, NoteBox, StepsSection, ToolPageShell } from '../components/ToolPage';
import { faqJsonLd } from '../lib/seo';

const FAQ = [
  {
    question: 'Where does my text go?',
    answer:
      'Nowhere. Counting runs in this tab as you type; the page makes no request with your text. You can disconnect from the network and the counters keep working.',
  },
  {
    question: 'How are words, sentences and paragraphs counted?',
    answer:
      'Words are runs of non-whitespace characters. Sentences end at . ! ? or … followed by a space or the end of the text. Paragraphs are blocks separated by blank lines — a single Enter does not start a new one. The “How these numbers are counted” panel in the tool lists every rule.',
  },
  {
    question: 'Why is my sentence count different from what I expect?',
    answer:
      'Abbreviations (e.g., Dr., approx.) and decimals (3.14) contain sentence punctuation followed by characters, and the counter does not try to know the difference. Treat the sentence count as an approximation and the word count as exact.',
  },
  {
    question: 'Does it count emoji and other languages correctly?',
    answer:
      'Characters are Unicode code points, so accented letters, symbols and CJK characters count one each. Scripts without spaces (Chinese, Japanese, Thai) count as one word per contiguous block — a known limitation of whitespace-based word counting.',
  },
  {
    question: 'Is the reading time accurate?',
    answer:
      'It is an estimate: words divided by 200 words per minute, rounded to the nearest minute (minimum one minute for non-empty text). Reading speed varies by person and material.',
  },
];

export function WordCounterPage() {
  return (
    <ToolPageShell
      crumbs={[{ label: 'Text Tools', to: '/text-tools/' }, { label: 'Word Counter' }]}
      title="Word Counter"
      intro="Count words, characters (with and without spaces), sentences, paragraphs and reading time as you type. Every counting rule is documented, and your text never leaves this browser tab."
      jsonLd={[faqJsonLd(FAQ)]}
    >
      <WordCounter />

      <StepsSection
        steps={[
          'Click the text area and start typing, or paste existing text — counts update on every keystroke.',
          'Read the six cards: words, characters, characters without spaces, sentences, paragraphs and estimated reading time.',
          'Open “How these numbers are counted” to see the exact rule behind any number.',
          'Use Copy, Clear or Load sample text from the buttons under the text area.',
        ]}
      />

      <ContentSection id="example-heading" title="A real example">
        <p>
          Paste a two-paragraph email with four sentences in total. The cards show: words (every
          whitespace-separated run), characters including spaces, characters without spaces,
          sentences (four), and paragraphs (two — the blank line between them starts a new one).
          Reading time shows <strong>~1 min</strong>, because anything under ~100 words rounds to a
          minute at 200 words per minute.
        </p>
        <p>
          Type a number like <code>3.14</code> at the end of a sentence and the sentence count
          rises — that is the documented approximation at work, not a bug.
        </p>
      </ContentSection>

      <ContentSection id="formats-heading" title="What is counted and how">
        <p>
          <strong>Words:</strong> contiguous runs separated by whitespace (spaces, tabs, line
          breaks, Unicode spaces).
        </p>
        <p>
          <strong>Characters:</strong> Unicode code points, spaces included. “No spaces” removes
          every whitespace character first.
        </p>
        <p>
          <strong>Paragraphs:</strong> non-empty blocks separated by one or more blank lines.
        </p>
        <p>
          <strong>Sentences:</strong> segments ending in . ! ? … followed by whitespace or the end
          of the text.
        </p>
        <p>
          <strong>Reading time:</strong> words ÷ 200 wpm, rounded — always an estimate.
        </p>
      </ContentSection>

      <ContentSection id="limitations-heading" title="Known limitations">
        <ul>
          <li>Sentence counting does not understand abbreviations or decimals.</li>
          <li>
            Whitespace-based word counting undercounts spaceless scripts (Chinese, Japanese,
            Thai) — one contiguous block counts as one word.
          </li>
          <li>
            Combining accents and multi-code-point emoji are counted per code point (a family emoji
            may count as several characters).
          </li>
          <li>Reading time is a mathematical estimate, not a measurement of anyone's reading.</li>
        </ul>
      </ContentSection>

      <NoteBox tone="privacy">
        The text area is ordinary page state: nothing is uploaded, stored or logged by SnapKit.
        Copy uses your browser's clipboard API and asks for clipboard permission only when you
        press Copy.
      </NoteBox>

      <ContentSection id="troubleshooting-heading" title="Troubleshooting">
        <ul>
          <li>
            <strong>Copy does nothing:</strong> clipboard permission was denied — select the text
            manually and copy with Ctrl/Cmd+C.
          </li>
          <li>
            <strong>Counts jumped after pasting:</strong> hidden whitespace from PDFs or emails
            counts like any other character; the “No spaces” card shows the difference.
          </li>
          <li>
            <strong>Paragraphs look merged:</strong> paragraphs need a blank line between them — a
            single line break stays inside the same paragraph by design.
          </li>
        </ul>
      </ContentSection>

      <FaqSection items={FAQ} />
    </ToolPageShell>
  );
}
