---
title: How to Resize an Image Without Stretching It
date: 2026-10-12
---

Stretching is what happens when you change one dimension of a photo and forget the other. This guide explains why pictures distort, how aspect ratio keeps them honest, and the exact steps to resize without ever pulling the image out of shape.

## Why images stretch

Every image is a grid of pixels with a **width** and a **height** — for example 4032 × 3024. That pair implies an **aspect ratio** (width ÷ height = 1.333, or 4:3). The picture *looks* right only because the pixels stay square and in that ratio.

If you set the width to 1200 but leave the height at 3024, the app squeezes 4032 pixels of horizontal detail into 1200 while keeping 3024 vertical pixels. Nothing is "wrong" inside the file — the grid is simply distorted, so faces get wider or thinner. The fix is mathematical, not artistic: **compute the second dimension from the first using the ratio**.

## The formula

```
new height = new width × (original height ÷ original width)
```

A 4032 × 3024 photo at 1200 px wide → 1200 × (3024 ÷ 4032) = **900 px**. Keep that pairing and the picture cannot stretch.

## Do it with a lock instead of arithmetic

1. [Open the Image Resizer](/image-resizer/) and choose your file. Its dimensions are read automatically.
2. Leave the **aspect-ratio lock enabled** (the link icon between the fields — it is on by default).
3. Type the side you care about; the other recalculates instantly so proportions hold.
4. Need a percentage instead? Switch to **Percentage mode** and drag the slider — 50% halves both sides together.
5. Check the numbers shown, press *Resize*, and download.

The lock computes the same formula for you, so you never risk the mismatch that causes stretching. Unlock it only when you deliberately want a non-standard shape — and the tool will tell you the ratio is unlocked while you do.

## Common mistakes

- **Setting both fields independently.** Typing width *and* then height without a lock is exactly how distortion happens. With the lock on, typing one updates the other — type carefully from there.
- **Rotating the numbers.** A portrait 3:4 photo stays portrait: 1350 wide needs 1800 tall, not the other way round. If you need a landscape crop, you must **crop**, not resize.
- **Resizing to "fix" a blurry photo.** Enlarging adds pixels, never detail. If the source is soft, no target size repairs it — see the resizer's limitations section.
- **Chaining resizes.** Each save re-encodes. Going 4032 → 2000 → 1000 costs quality twice; pick the final size once and do it in one pass.

## Resizing vs cropping vs scaling

| You want to… | Use | Effect |
|---|---|---|
| Make the whole picture smaller, same shape | Resize with lock | Every pixel is resampled |
| Change the shape (4:3 → 16:9) | Crop, then resize | Content is removed from the edges |
| Display it larger without a bigger file | Nothing — you can't create detail | Quality drops |

## When the shape *must* change

Some placements demand a ratio your photo does not have (a 3:1 profile banner, for instance). Then the honest sequence is: **crop to the target ratio first** in an editor, then resize with the [Image Resizer](/image-resizer/) to the exact pixels — or check the target dimensions first in the [Social Image Size Guide](/social-image-sizes/).

*Last reviewed: 2026-10-12.*
