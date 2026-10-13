import { describe, expect, it } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { allRoutes } from '../lib/routes';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('direct navigation to every route', () => {
  const routes = allRoutes().filter((route) => route.path !== '/process-images/');

  it.each(routes.map((route) => [route.path, route] as const))(
    'renders %s with its unique title, canonical and H1',
    (path, route) => {
      renderAt(path);

      // one H1, present on every page
      const headings = screen.getAllByRole('heading', { level: 1 });
      expect(headings.length).toBe(1);

      // title comes from the shared registry and is unique across routes
      expect(document.title).toBe(route.title);

      const canonical = document.querySelector('link[rel="canonical"]');
      const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
      if (route.noindex) {
        expect(robots?.content).toBe('noindex, nofollow');
      } else {
        expect(canonical?.getAttribute('href')).toBe(`https://snapkit.42web.io${route.path}`);
      }

      // meta description present and long enough to be meaningful
      const description =
        (document.querySelector('meta[name="description"]') as HTMLMetaElement | null)?.content ?? '';
      expect(description.length).toBeGreaterThan(40);

      cleanup();
    },
  );

  it('/process-images/ redirects to the matching tool', () => {
    renderAt('/process-images/');
    // No params → lands on the tool directory with its metadata.
    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(/All Tools/i);
    cleanup();
  });

  it('redirects slashless URLs to the canonical trailing-slash form', () => {
    renderAt('/image-compressor');
    expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent(/Image Compressor/i);
    cleanup();
  });

  it('renders the custom 404 page for unknown paths with noindex', () => {
    renderAt('/totally/unknown/path/');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/could not find/i);
    const robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    expect(robots?.content).toBe('noindex, nofollow');
    expect(document.title).toBe('Page Not Found | SnapKit');
    cleanup();
  });

  it('guides render their article body from Markdown', () => {
    renderAt('/guides/jpeg-vs-png-vs-webp/');
    const h1 = screen.getAllByRole('heading', { level: 1 })[0];
    expect(h1).toHaveTextContent(/JPEG vs PNG vs WebP/i);
    expect(screen.getByRole('heading', { name: /How each format compresses/i })).toBeInTheDocument();
    cleanup();
  });
});
