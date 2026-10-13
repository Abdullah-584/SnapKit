---
title: How to Choose Image Dimensions for Social Media
date: 2026-10-12
---

Wrong dimensions get your picture cropped at the worst possible moment — the logo half-gone, the caption under a gradient, the subject sliced by a UI overlay. This guide shows how to read platform specs, why ratios matter more than raw pixels, and how to produce one master image that survives every network.

## Read the spec before you shoot

Every placement publishes (or settles on) three things:

1. **Canvas size** — the pixels the platform expects, e.g. 1080 × 1350.
2. **Aspect ratio** — width ÷ height, e.g. 4:5. Platforms crop *toward* their preferred ratio, which is what actually matters.
3. **File limits** — format and maximum size, where documented.

SnapKit's [Social Image Size Guide](/social-image-sizes/) lists all three per placement, with the source link and the date each number was verified — including labels for which numbers are **official** and which are community **conventions** (platforms often publish no exact pixels for organic posts).

## Why the ratio beats the pixels

Apps display and crop toward their own shapes:

- A **4:5** portrait uses the most vertical space in a feed before the “more” cut.
- A **1:1** square is the safe middle ground everywhere.
- **Stories/Reels 9:16** fills the phone screen — keep key content away from the top 10% and bottom 15% where the app's own UI (profile, buttons, captions) will cover it.
- **Wide banners** (1500 × 500 on X, 1584 × 396 on LinkedIn, 2560 × 1440 on YouTube) are cropped differently on desktop and mobile — the platform usually defines a *safe area* inside the canvas; keep text and logos in it.

Upload at the target ratio and nothing surprises you. Upload a mismatched shape and the platform auto-crops — sometimes centred, sometimes favouring faces, sometimes not what you intended.

## Make one master, then derive

1. **Choose the largest true resolution** you have (ideally the camera's original).
2. **Compose with margins**: leave breathing room around edges; the least safe place for critical content is the outer band of any banner or vertical post.
3. **Export per platform** at the target pixels from the master — never downscale an already-downscaled file repeatedly, each save re-encodes and softens detail.
4. **Verify** with the tool: open the [Social Image Size Guide](/social-image-sizes/), find the row, and press its **Resize** button — the [Image Resizer](/image-resizer/) opens with those exact dimensions prefilled. Choose your master, confirm, download.
5. **Name outputs clearly** — `post-instagram-1080x1350.jpg`, `banner-x-1500x500.jpg`.

## Choosing the format

- **Photographs** → JPEG (or WebP) at quality 80%+: smallest files, accepted everywhere.
- **Text, logos, flat graphics** → PNG for crisp edges, or WebP where transparency is needed.
- Watch the **file-size limits** shown in the table rows (e.g. X's 2 MB profile picture, Pinterest's 20 MB Pins, YouTube's 50 MB desktop thumbnail limit). Exceeding them rejections are common.

## Quality and long-term habits

- Upload the **largest sensible file** in the target dimensions; platforms downscale server-side anyway, and their encoders are usually the last lossy step.
- If you re-post the same image monthly, keep the original master locally — every network round-trip through “download, edit, re-upload” accumulates generational loss.
- Dimensions change: Instagram and TikTok in particular shift placements. Re-check the **verified date** on each row before a campaign; the source links open the platform's own documentation.

## Next steps

- Browse current numbers: [Social Image Size Guide](/social-image-sizes/)
- Resize to any of them in one click: [Image Resizer](/image-resizer/)
- Keep files small without visible damage: [How Image Compression Affects Quality](/guides/image-compression-quality/)

*Last reviewed: 2026-10-12.*
