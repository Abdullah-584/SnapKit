# SnapKit — Free Tools. Quick Results.

A production-ready, privacy-first online tools website: compress, resize and convert
images, count words, and look up social media image sizes — all **in the browser**,
with no backend, no accounts and no paid services.

- **Site URL:** https://snapkit.42web.io (configurable — see [Environment](#environment))
- **Stack:** React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 7 · Lucide icons · Vitest
- **Hosting target:** static hosting; production config for **InfinityFree / 42web.io** included

## Quick start

```bash
npm install          # install dependencies
npm run dev          # start dev server (prints the local URL)
npm run test         # run the automated test suite (91 tests)
npm run typecheck    # TypeScript project build check
npm run build        # typecheck → client build → SSR build → prerender → verify
npm run preview      # serve the production build locally
```

`npm run build` fails loudly unless every acceptance artifact exists in `dist/`:
prerendered HTML for all 20 indexable routes, unique titles, correct canonical URLs,
`sitemap.xml`, `robots.txt`, `404.html`, `.htaccess` and the referenced JS/CSS assets.

## What is implemented

**Working tools (all browser-side):**

| Tool | Route | What it really does |
|---|---|---|
| Image Compressor | `/image-compressor/` | Decodes JPG/PNG/WebP, re-encodes with quality slider + format choice, reports *measured* output size and reduction |
| Image Resizer | `/image-resizer/` | Pixel or percentage resizing, aspect-ratio lock, dimension validation, presets from URL (`?width=&height=`) |
| Image Format Converter | `/image-converter/` | JPEG ⇄ PNG ⇄ WebP with runtime encoder detection, transparency warnings, real size comparison |
| Word Counter | `/word-counter/` | Live word/char/sentence/paragraph counts, reading time, documented rules, copy/clear/sample |
| Social Image Size Guide | `/social-image-sizes/` | Searchable directory of 25 researched specs with status labels, source links, verification date, one-click resize |

**Pages:** Home, All Tools directory, Image Tools, Text Tools, Guides index, 5 guide
articles (Markdown-driven), About, Contact, Privacy Policy, Terms of Use, Cookie &
Preferences, custom 404 (served with a real HTTP 404), plus the internal
`/process-images/` redirect page (noindex).

**System:** route registry (single source of truth), SEO head management with
canonical/OG/JSON-LD, breadcrumbs, prerendering, sitemap + robots generation,
consent-aware optional AdSense slot (inert by default), responsive nav, skip link,
accessible loading/error/empty states.

## Architecture

```
src/
  components/   Header, Footer, Layout, ToolCard, ToolSearch, Breadcrumbs, SEO,
                PageShell/ToolPage (page templates), ImageToolParts, States, AdSlot…
  tools/        The five tool UIs (stateful components)
  pages/        Route components (tool pages wrap tools with instructions/FAQ)
  content/guides/  Markdown articles (frontmatter + body)
  lib/          routes.ts (registry), seo.ts, imageProcessing.ts, formatters.ts,
                tools.ts, guides.ts, socialImageSizes.ts, consent.ts, markdown.ts
  entry-server.tsx  SSR render used by the prerender step
scripts/        prerender.mjs (renders routes, sitemap, 404), verify-build.mjs
public/         favicon.svg, robots.txt, site.webmanifest, .htaccess
```

Build pipeline: `tsc -b` → `vite build` → `vite build --ssr` → `prerender.mjs` →
`verify-build.mjs`. Every canonical route is written to its own directory
(`dist/image-compressor/index.html` …), so on Apache each route is a **real URL
with a 200 status**, unknown paths fall through to `ErrorDocument 404 /404.html`
(real 404 status), and `DirectorySlash` 301-redirects slashless URLs to the
canonical trailing-slash form. No front-controller rewrite is required.

## Environment

All variables are optional build-time values (see `.env.example`):

| Variable | Purpose | Default |
|---|---|---|
| `VITE_SITE_URL` | Canonical origin for canonical/OG/sitemap URLs | `https://snapkit.42web.io` |
| `VITE_CONTACT_EMAIL` | Mailbox shown on `/contact/` | empty → honest “not configured” state |
| `VITE_ADSENSE_CLIENT` | Real `ca-pub-…` publisher ID | empty → **all ad code disabled** |

Never commit real secrets; these are public values anyway — ads and contact stay
disabled until you deliberately configure them.

## Deployment (InfinityFree / 42web.io)

The `snapkit.42web.io` subdomain is served by **InfinityFree** free hosting:
static files only, Apache with `.htaccess` support, automatic HTTPS for free
subdomains, ~10 MB per file / 30 000 files / 5 GB disk on the free tier. It does
**not** run Node.js — which is why the build produces a fully static `dist/`.

1. **Install & verify locally**
   ```bash
   npm install && npm run test && npm run build
   npm run preview   # check http://localhost:4173
   ```
2. **Log in to the InfinityFree client area** → your account for `42web.io` →
   **File Manager** (or FTP: host `ftpupload.net`, your FTP credentials).
3. **Upload the entire contents of `dist/`** into the `htdocs/` folder.
   Keep `.htaccess` (it is hidden — enable “show hidden files” in the File Manager).
   Verify these exist afterwards: `.htaccess`, `robots.txt`, `sitemap.xml`,
   `404.html`, `index.html`, and one directory per route.
4. **HTTPS:** free subdomains get a certificate automatically — enable
   *SSL/TLS → Free SSL* in the panel if it is not active, then force HTTPS.
5. **Nested routes:** open a deep link directly (e.g.
   `https://snapkit.42web.io/image-compressor/`) and refresh it. It must load
   with HTTP 200. Open a nonsense URL — it must return HTTP **404** with the
   custom page (not a host-branded error).
6. **Canonical & sitemap checks**
   - View source: `<link rel="canonical">` equals the live URL on each page.
   - `https://snapkit.42web.io/sitemap.xml` lists exactly the 20 indexable URLs.
   - `robots.txt` does not disallow anything and points at the sitemap.
7. **Google Search Console:** add the `https://snapkit.42web.io` property
   (URL-prefix), verify via HTML tag (paste the meta tag into `index.html`’s
   head, rebuild, redeploy) or DNS/domain provider, then **submit the sitemap**.
8. **Analytics (optional):** none is installed. If you add any, gate it behind
   the existing consent state (`src/lib/consent.ts`) and disclose it in the
   Privacy Policy first.
9. **AdSense:** follow `docs/ADSENSE-READINESS.md`. Only after *approval* set
   `VITE_ADSENSE_CLIENT`, rebuild and deploy — never before.

### Migrating to a custom domain

Change `VITE_SITE_URL`, point DNS at the new host, redeploy. Canonical URLs,
Open Graph and the sitemap pick up the new origin automatically; the old domain
should 301-redirect to it.

## Testing

```bash
npm run test
```

Covers: file validation, dimension limits, encoder feature detection, compression /
resize / conversion flows with real byte bookkeeping, transparency warnings, word-count
edge cases (Unicode, no-space scripts, sentence/paragraph rules), tool search
empty/no-results/reset states, mobile navigation, per-route direct navigation with
unique titles + canonical + H1 checks, 404 noindex, Markdown guides, consent storage.
Canvas encoding is stubbed in jsdom (the browser does the real encoding at runtime);
everything SnapKit itself computes is asserted against real values.

## Known limitations / honest notes

- Contact mailbox is not configured yet (blocker below) — the page says so instead of faking it.
- Social media dimensions are labelled *official* vs *convention* per row, with sources and a verification date; platforms change specs without notice.
- Sentence counting cannot detect abbreviations/decimals (documented in the UI).
- PNG re-encoding can produce larger files than the input — reported honestly.
- No analytics, no ads, no accounts, no backend — by design for the MVP.

## Pre-launch blockers

1. Set `VITE_CONTACT_EMAIL` to a real mailbox (InfinityFree accounts include mailboxes) and rebuild.
2. Deploy `dist/` to the host and run the nested-route/404/sitemap checks above.
3. Have Privacy Policy / Terms reviewed for your jurisdiction (they state plainly that they are not legal advice).
4. Register in Search Console and submit the sitemap.
