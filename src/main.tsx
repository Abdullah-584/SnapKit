import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

function normalize(path: string): string {
  const clean = path.split('?')[0].split('#')[0];
  if (clean !== '/' && !clean.endsWith('/')) return `${clean}/`;
  return clean;
}

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

const prerenderedPath = document.documentElement.dataset.prerenderPath ?? '';
const shouldHydrate = Boolean(prerenderedPath) && normalize(prerenderedPath) === normalize(window.location.pathname);

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (shouldHydrate) {
  hydrateRoot(container, app);
} else {
  // Static HTML from another route (e.g. the custom 404 page) — replace it.
  container.innerHTML = '';
  createRoot(container).render(app);
}
