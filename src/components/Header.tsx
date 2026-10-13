import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Search, X } from 'lucide-react';
import { Logo } from './Logo';

const NAV_ITEMS = [
  { label: 'Home', to: '/', end: true },
  { label: 'Image Tools', to: '/image-tools/', end: false },
  { label: 'Text Tools', to: '/text-tools/', end: false },
  { label: 'Guides', to: '/guides/', end: false },
  { label: 'About', to: '/about/', end: false },
];

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? 'rounded-lg px-3 py-2 text-sm font-semibold text-brand'
    : 'rounded-lg px-3 py-2 text-sm font-medium text-ink-soft hover:bg-surface hover:text-brand';
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever navigation happens.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" aria-label="SnapKit home" className="shrink-0">
          <Logo className="h-8" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            to="/tools/"
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink-soft hover:border-brand hover:text-brand"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search tools</span>
            <span className="sr-only sm:hidden">Search tools</span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink-soft hover:bg-surface md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Main mobile"
        hidden={!menuOpen}
        className="border-t border-line bg-white md:hidden"
      >
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <ul className="grid gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={(state) => `${navLinkClass(state)} block`}
              >
                {item.label}
              </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/tools/" className={(state) => `${navLinkClass(state)} block`}>
                All Tools
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
