---
title: How to Compress an Image for Email
date: 2026-10-12
---

Email attachments have a hard size ceiling, and one full-resolution photo can blow straight through it. This guide shows how to shrink an image so it attaches cleanly — what actually limits attachments, which format to pick, and how small is small enough.

## What actually limits attachment size

Most major email providers cap attachments around **25 MB per message** (Gmail and Outlook.com are the well-known examples), while some corporate systems sit at 10–20 MB. The limit counts the *encoded* size of the message — attachments are base64-encoded, which adds roughly a third on top of the raw file size. So a 20 MB photo can become a ~27 MB message and get rejected.

Practical target: **keep every attachment under 15 MB total** so encoding overhead never pushes you over the limit. If you are sending several photos, budget across all of them, not each one.

## The quickest path

1. [Choose your photo in the Image Compressor](/image-compressor/) — JPG, PNG and WebP up to 30 MB are supported.
2. Set the output format to **JPEG** for photographs (or **WebP** if you know the recipient's mail client is modern — most are, but JPEG is the safe default).
3. Start at **quality 80%** and press *Compress image*.
4. Read the measured output size. If it is still over your budget, drop quality to 60–70% and compress again — the tool shows the real numbers each time.
5. Download the result and attach it.

The whole thing runs in your browser: your photo is never uploaded to any server (see the tool page for details).

## A worked example

A 4032 × 3024 phone photo arrives at about **3.2 MB**. Compressing at quality 80% typically lands around **400–800 KB** depending on detail — that is roughly a **75–87% reduction** measured from the actual byte counts. Well under any provider limit, and usually indistinguishable at normal viewing size.

If the source is already a heavily-compressed JPEG, re-encoding can barely shrink it further — or even grow it. The tool reports the real figure either way; that is why the result card shows both numbers instead of a promised ratio.

## Choosing the format

| You are sending… | Use | Why |
|---|---|---|
| Photographs | JPEG | Smallest for continuous-tone images |
| Logos, screenshots, transparency | PNG | Lossless; keeps sharp edges and alpha |
| Modern recipients, max savings | WebP | Often smaller than JPEG at the same quality |

For the full comparison, read [JPEG vs PNG vs WebP](/guides/jpeg-vs-png-vs-webp/).

## What you lose

- **Detail** — lossy compression discards subtle variation. At 80% it is rarely visible; at 40% banding appears in gradients.
- **Metadata** — re-encoding strips EXIF (camera model, timestamps, GPS). Usually a privacy win, but worth knowing.
- **Generational quality** — compressing a file that has already been compressed three times stacks the damage. Always start from the original.

## Tips for smaller attachments

- **Resize first** when the recipient only needs a screen-sized image: 1600 px wide is plenty for reading on a phone ([Image Resizer](/image-resizer/)).
- **Attach a link instead** for very large or very many files — a cloud link plus a small preview image beats a 24 MB message.
- **Screenshots → PNG → maybe WebP**: PNG keeps text crisp; if the file is too big, convert to WebP (or JPEG at 80%+) with the [Image Format Converter](/image-converter/).

## Source notes

- Gmail's official documentation states the 25 MB attachment limit and recommends Drive links for larger files: [Gmail Help — Send attachments](https://support.google.com/mail/answer/6592?hl=en)
- Microsoft support documents the 25 MB limit for Outlook.com: [Microsoft support — attach files in Outlook on the web](https://support.microsoft.com/en-us/office/attach-files-in-outlook-com-c0361e02-744d-4e07-a849-d7c1cd4f3608)

*Last reviewed: 2026-10-12.*
