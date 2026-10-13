import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordCounter } from './WordCounter';

function wordCard(label: string): HTMLElement {
  const cards = screen.getAllByText(label);
  const card = cards[0].closest('div');
  if (!card) throw new Error(`no card for ${label}`);
  return card;
}

describe('WordCounter', () => {
  it('starts empty with zeroed stats', () => {
    render(<WordCounter />);
    expect(wordCard('Words')).toHaveTextContent('0');
    expect(wordCard('Characters')).toHaveTextContent('0');
    expect(wordCard('Reading time')).toHaveTextContent('—');
  });

  it('updates words, characters and sentences as you type', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);
    await user.type(screen.getByRole('textbox'), 'Hello world. How are you?');

    expect(wordCard('Words')).toHaveTextContent('5');
    expect(wordCard('Characters')).toHaveTextContent('25');
    expect(wordCard('No spaces')).toHaveTextContent('21');
    expect(wordCard('Sentences')).toHaveTextContent('2');
    expect(wordCard('Paragraphs')).toHaveTextContent('1');
    expect(wordCard('Reading time')).toHaveTextContent('~1');
  });

  it('documents its counting rules in-page', () => {
    render(<WordCounter />);
    expect(screen.getByText(/How these numbers are counted/i)).toBeInTheDocument();
    expect(screen.getByText(/Split at/i)).toBeInTheDocument();
  });

  it('clear and sample buttons drive the text area', async () => {
    const user = userEvent.setup();
    render(<WordCounter />);
    const box = screen.getByRole('textbox');

    await user.click(screen.getByRole('button', { name: /Load sample text/i }));
    expect((box as HTMLTextAreaElement).value.length).toBeGreaterThan(50);

    await user.click(screen.getByRole('button', { name: /Clear/i }));
    expect((box as HTMLTextAreaElement).value).toBe('');
    expect(wordCard('Words')).toHaveTextContent('0');
  });
});
