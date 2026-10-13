---
title: How Image Compression Affects Quality
date: 2026-10-12
---

Every compression tool asks you to trade something. This guide explains what the quality slider actually changes, why lossy formats look worse as they shrink, and how to find the point where the file gets smaller without your eyes noticing.

## Lossy vs lossless in one breath

- **Lossy** (JPEG, WebP-lossy): the encoder *approximates* the original and throws the difference away. Smaller files, permanent change. The detail it discards is chosen to be the part humans notice least.
- **Lossless** (PNG, WebP-lossless): the pixels round-trip exactly, forever. Size reduction only comes from better packing of the data, not from simplifying it — which is why re-compressing an already-optimal PNG often does nothing or even grows the file.

## What the quality slider really does

In a JPEG encoder, **quality (1–100) controls quantisation**: how finely the frequency coefficients of each 8×8 pixel block are recorded. High quality keeps fine steps between coefficients (large file, faithful detail); low quality rounds them to coarser steps (small file, smeared detail). The mapping of the 1–100 number to actual compression is encoder-specific — the same "quality 75" in two programs can produce different files.

In SnapKit's [Image Compressor](/image-compressor/) the slider maps 10–100% directly onto the browser's encoder, and the **output size shown is measured from the produced file**, not predicted — so you can read the trade honestly at every setting.

## Where quality goes first

Compression damage is not uniform. It concentrates in:

1. **Fine, high-frequency texture** — grass, fabric weave, hair against a busy background.
2. **Smooth gradients** — skies and skin show *banding* (visible steps) first at low quality.
3. **Sharp edges near contrast** — text and hard borders develop *ringing* (halo ripples). This is why text-heavy images should stay PNG.
4. **Flat areas are the cheapest** — large single-colour regions compress well at almost any quality.

## A method that works every time

1. Start at **quality 80%** in the compressor and compress.
2. Open the downloaded result and **zoom to 100%** on a textured area.
3. If you cannot see a difference, drop 10 points and repeat; stop when the first artifacts appear, then go back up one step.
4. Check the file size against your target (email ~15 MB total, social platforms have their own limits).
5. Keep the master at full quality — export compressed *copies* for sending.

Typical landing zones: photos for the web **75–85%**, web graphics with soft edges **60–75%**, line art and screenshots — **don't use JPEG at all**, keep PNG (or WebP) instead.

## The generational loss problem

Each lossy save re-encodes the *previous* compression's output. Five cycles at 85% look worse than one cycle at 85% even though each single step was invisible. If you edit repeatedly:

- keep one uncompressed or PNG **master**,
- compress **once** at the end, and
- never use a heavily-compressed JPEG as your working file.

## Signs you compressed too far

- Banding or posterisation in gradients (skies, shadows).
- Blocky 8×8 structure in low-contrast areas.
- Ringing around text and logos.
- JPEG artifacts on an already-processed image stacking into a "mushy" look.

Back the quality up one notch — the tool's size numbers will show exactly what that costs.

## How compression affects perceived sharpness

Perceived sharpness is high-frequency detail, which is precisely what lossy encoders drop. Slight blur at low quality can *seem* smaller too: the eye reads smoothness as distance. If sharpness is critical (product photos, screenshots, charts), raise quality or switch format before raising pixel dimensions — extra pixels never substitute for thrown-away detail.

## Sources

- The JPEG File Interchange Format / ITU-T T.81 specification (quality/quantisation): [itu.int/rec/T-REC-T.81](https://www.itu.int/rec/T-REC-T.81)
- Google WebP lossy, lossless and quality study: [developers.google.com/speed/webp](https://developers.google.com/speed/webp)
- W3C Media Types / image formats: [www.w3.org/TR/PNG/](https://www.w3.org/TR/PNG/)

*Last reviewed: 2026-10-12.*
