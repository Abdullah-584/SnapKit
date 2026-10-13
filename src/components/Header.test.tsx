import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Header } from './Header';

describe('Header', () => {
  it('renders the logo and all main navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: /SnapKit home/i })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    for (const label of ['Home', 'Image Tools', 'Text Tools', 'Guides', 'About']) {
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole('link', { name: /Search tools/i })).toHaveAttribute('href', '/tools/');
  });

  it('mobile menu starts closed and toggles with accessible state', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    const button = screen.getByRole('button', { name: /Open menu/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    // closed state: the nav carries the hidden attribute (out of the a11y tree)
    expect(document.getElementById('mobile-menu')).toHaveAttribute('hidden');

    await user.click(button);
    expect(screen.getByRole('button', { name: /Close menu/i })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Main mobile' })).toBeInTheDocument();
    expect(document.getElementById('mobile-menu')).not.toHaveAttribute('hidden');

    await user.click(screen.getAllByRole('link', { name: 'About' })[0]);
    // menu closes after navigation
    expect(document.getElementById('mobile-menu')).toHaveAttribute('hidden');
  });
});
