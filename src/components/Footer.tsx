import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';
import { TOOLS, CATEGORY_META } from '../lib/tools';

const GROUPS = [
  {
    heading: 'Site',
    links: [
      { label: 'Home', to: '/' },
      { label: 'All Tools', to: '/tools/' },
      { label: 'Guides', to: '/guides/' },
      { label: 'About Us', to: '/about/' },
      { label: 'Contact Us', to: '/contact/' },
    ],
  },
  {
    heading: 'Image Tools',
    links: TOOLS.filter((t) => t.category === 'image').map((t) => ({ label: t.name, to: t.path })),
  },
  {
    heading: 'Text & Guides',
    links: [
      ...TOOLS.filter((t) => t.category === 'text').map((t) => ({ label: t.name, to: t.path })),
      { label: CATEGORY_META.guides.name, to: CATEGORY_META.guides.path },
      { label: 'Social Image Sizes', to: '/social-image-sizes/' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy/' },
      { label: 'Terms of Use', to: '/terms-of-use/' },
      { label: 'Cookie & Privacy Preferences', to: '/cookie-preferences/' },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Link to="/" aria-label="SnapKit home">
              <Logo className="h-8" />
            </Link>
            <p className="mt-3 text-sm font-medium text-ink-soft">Free Tools. Quick Results.</p>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <span>Supported image operations run locally in your browser — your files are not uploaded.</span>
            </p>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {GROUPS.map((group) => (
              <div key={group.heading}>
                <h2 className="text-sm font-semibold text-ink">{group.heading}</h2>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className="text-sm text-ink-soft hover:text-brand hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} SnapKit. All tools are free to use.</p>
          <p>
            <Link to="/privacy-policy/" className="hover:text-brand hover:underline">
              Privacy-first by design
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
