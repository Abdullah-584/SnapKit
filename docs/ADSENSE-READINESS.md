# AdSense Readiness Checklist

SnapKit is built to *qualify* for a Google AdSense application — not to guarantee
approval, rankings or earnings. As of the last review, **no publisher ID is
configured and no ad code loads anywhere on the site.**

## Content & structure

- [x] Five genuinely functional tools that work with real user input and output
- [x] Original educational content (5 guides, written for this site, with cited sources)
- [x] Meaningful, unique page content on every indexable page (no empty shells)
- [x] Clear site identity: original logo, tagline, Home / Image Tools / Text Tools / Guides / About in the header
- [x] Working About page explaining purpose, audience and privacy approach
- [x] Working Contact page (states honestly whether a mailbox is configured)
- [x] Accurate Privacy Policy matching actual technical behaviour
- [x] Terms of Use with permitted use, limitations, IP and liability clauses
- [x] Cookie & Privacy Preferences page with granular, reversible choices
- [x] Footer links to every important page; no dead links (checked by tests + build verification)
- [x] Custom 404 page served with a real HTTP 404 status

## Policy compliance

- [x] No copied or scraped articles — all guides are original and source-cited
- [x] No fake traffic, bots, or artificial engagement
- [x] No deceptive downloads: download buttons only appear next to a real processed blob
- [x] No misleading controls; every button performs its labelled action
- [x] No content built primarily to display ads
- [x] No ad units exist yet — therefore no ads resembling tool buttons
- [x] No forced redirects, pop-ups, or automatic downloads
- [x] Nothing encourages clicks on advertisements
- [x] Error pages and empty search results contain no ad slots (slots only render inside content pages, never in `NotFound` or empty states)
- [x] Ad slots (when enabled) are visually distinct, never beside download buttons
- [x] The site stays fully usable when ads are blocked (`AdSlot` renders nothing)
- [x] Consent required before any advertising cookie is set (banner + preferences page)

## Technical readiness

- [x] HTTPS on the target host (InfinityFree provides certificates for free subdomains)
- [x] Mobile-responsive layout (320 px → desktop)
- [x] Keyboard-accessible controls with visible focus indicators
- [x] Semantic landmarks, labelled inputs, ARIA only where needed
- [x] Unique titles, meta descriptions, canonical URLs, Open Graph on every indexable page
- [x] `sitemap.xml` with real canonical URLs; `robots.txt` allows crawling
- [x] Direct navigation and refresh work on every nested route (prerendered directories)
- [x] Core bundle: ~481 KB raw / ~148 KB gzip JS, ~41 KB CSS; Lighthouse to be measured post-deploy

## Before applying

- [ ] Deploy to https://snapkit.42web.io and confirm every route over HTTPS
- [ ] Set `VITE_CONTACT_EMAIL` to a real, monitored mailbox (blocker — see README)
- [ ] Review legal pages with someone familiar with your jurisdiction (not legal advice)
- [ ] Register the site in Google Search Console and submit the sitemap
- [ ] Measure Lighthouse (performance/a11y/SEO) on the live URL and fix regressions
- [ ] Optionally enable analytics **with consent** — currently none runs
- [ ] Apply for AdSense at adsense.google.com with the live URL
- [ ] After approval: put the real `ca-pub-…` ID in `VITE_ADSENSE_CLIENT`, rebuild, deploy
- [ ] Create ad units in AdSense, wire their slot IDs into `<AdSlot slot="…">`, rebuild
- [ ] Re-test consent flow: reject → no ad requests; accept → ads load; preferences → change mind

## Honesty rules baked into the code

- `AdSlot` loads zero script and renders zero markup unless `VITE_ADSENSE_CLIENT` is set **and** consent is granted.
- No fabricated publisher IDs, fake ad units, invented stats, or claims of approval appear anywhere.
- The Privacy Policy and Cookie Preferences page state the *actual* current status of ads and analytics.
