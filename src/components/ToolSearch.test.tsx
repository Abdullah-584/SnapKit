import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ToolSearch } from './ToolSearch';

function renderSearch(props: { showAllWhenEmpty?: boolean } = {}) {
  return render(
    <MemoryRouter>
      <ToolSearch id="t" showAllWhenEmpty={props.showAllWhenEmpty ?? false} />
    </MemoryRouter>,
  );
}

describe('ToolSearch', () => {
  it('starts in the empty state and explains it', () => {
    renderSearch();
    expect(screen.getByText(/Showing all 0 tools/i)).toBeInTheDocument();
  });

  it('finds tools by name and by purpose keywords', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByRole('searchbox'), 'compress');
    expect(screen.getByRole('link', { name: /Open tool/i })).toBeInTheDocument();
    expect(screen.getByText(/Image Compressor/)).toBeInTheDocument();
    expect(screen.getByText(/1 tool found/i)).toBeInTheDocument();
  });

  it('matches semantic keywords such as "word count"', async () => {
    const user = userEvent.setup();
    renderSearch();
    await user.type(screen.getByRole('searchbox'), 'word count');
    expect(screen.getByText(/Word Counter/)).toBeInTheDocument();
  });

  it('shows a no-results state and resets', async () => {
    const user = userEvent.setup();
    renderSearch();
    const box = screen.getByRole('searchbox');
    await user.type(box, 'zzzz-nothing');
    expect(screen.getByText(/No tools match/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Reset search/i }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByText(/Showing all 0 tools/i)).toBeInTheDocument();
  });

  it('shows the full catalogue when showAllWhenEmpty', () => {
    renderSearch({ showAllWhenEmpty: true });
    expect(screen.getByText(/Showing all 5 tools/i)).toBeInTheDocument();
  });
});
