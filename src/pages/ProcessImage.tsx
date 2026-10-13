import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const TARGETS: Record<string, string> = {
  compress: '/image-compressor/',
  resize: '/image-resizer/',
  convert: '/image-converter/',
};

/**
 * /process-images/?… — a shareable deep link that forwards to the matching
 * tool while preserving its query settings (width/height/format/quality).
 * Redirects in an effect (so server rendering produces a real fallback page)
 * and is marked noindex in the route registry.
 */
export function ProcessImage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const targetParam = params.get('target');
    const target =
      (targetParam && TARGETS[targetParam]) ||
      (params.get('width') && params.get('height') ? '/image-resizer/' : '/tools/');
    const search = params.toString();
    navigate(search ? `${target}?${search}` : target, { replace: true });
    setReady(true);
  }, [navigate, params]);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-ink">Taking you to the right tool…</h1>
      <p className="mt-3 text-ink-soft" role="status" aria-live="polite">
        {ready
          ? 'Redirecting now.'
          : 'This link points at one of the image tools. If you are not redirected automatically, pick one below:'}
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        <li>
          <Link to="/image-compressor/" className="btn-secondary">
            Image Compressor
          </Link>
        </li>
        <li>
          <Link to="/image-resizer/" className="btn-secondary">
            Image Resizer
          </Link>
        </li>
        <li>
          <Link to="/image-converter/" className="btn-secondary">
            Image Converter
          </Link>
        </li>
      </ul>
    </div>
  );
}
