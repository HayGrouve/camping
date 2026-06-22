# Camping Checklist SEO & Open Graph Design

**Date:** 2026-06-22  
**Status:** Approved  
**Approach:** B — build-time generated OG image + static meta tags  
**Production URL:** https://palatki.netlify.app/  
**Hosting:** Netlify (Create React App static build)

## Goal

Improve metadata and SEO so link shares show a branded preview card on iMessage, Slack, Facebook, Twitter/X, etc. Use a **static branded** Open Graph image (same image every time), generated at build time to match the app's warm outdoors theme.

## Context

- CRA SPA: crawlers read `public/index.html` only; no JavaScript execution required for share previews
- Current `index.html` has title + theme-color only; no description, OG, or Twitter tags
- `site.webmanifest` uses generic names ("Camping" / "Camp")
- Netlify serves static `build/` output; no server/edge functions needed for this scope

## Out of Scope

- Dynamic OG image showing live packing progress
- Per-route meta tags
- Next.js migration or Netlify Functions
- i18n / alternate locales
- Favicon regeneration (unless trivially bundled with OG script)

## Share Image

### Output

- **File:** `public/og-image.png`
- **Dimensions:** 1200×630 px (Open Graph / Twitter `summary_large_image` standard)
- **URL (absolute):** `https://palatki.netlify.app/og-image.png`

### Visual design

| Element | Spec |
|---|---|
| Background | `#1f1b17` with subtle vertical gradient toward `#2e2822` |
| Accent | Forest green `#6b9b5a` decorative progress bar (static, ~60% fill) |
| Icon | Tent or campfire motif (inline SVG rendered into image) |
| Title | "Ceko's Camping Checklist" — warm off-white `#f0ebe3`, bold |
| Tagline | "Pack smarter for your next trip" — muted `#a89f94` |

### Generation pipeline

| Piece | Responsibility |
|---|---|
| `scripts/generate-og-image.mjs` | Build SVG string, render to PNG via `sharp` |
| `sharp` | devDependency |
| `package.json` | `"prebuild": "node scripts/generate-og-image.mjs"` |

The script writes to `public/og-image.png` before `react-scripts build` copies `public/` into `build/`.

**Commit policy:** Generated PNG may be committed to repo so Netlify builds work even if prebuild is skipped locally; prebuild keeps it in sync on every build.

## Meta & SEO Tags

**File:** `public/index.html`

### Standard meta

```html
<meta name="description" content="Phone-friendly camping packing checklist with progress tracking." />
<link rel="canonical" href="https://palatki.netlify.app/" />
```

### Open Graph

| Property | Value |
|---|---|
| `og:title` | Ceko's Camping Checklist |
| `og:description` | Phone-friendly camping packing checklist with progress tracking. |
| `og:image` | https://palatki.netlify.app/og-image.png |
| `og:image:width` | 1200 |
| `og:image:height` | 630 |
| `og:url` | https://palatki.netlify.app/ |
| `og:type` | website |
| `og:site_name` | Ceko's Camping Checklist |
| `og:locale` | en_US |

### Twitter / X

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Ceko's Camping Checklist" />
<meta name="twitter:description" content="Phone-friendly camping packing checklist with progress tracking." />
<meta name="twitter:image" content="https://palatki.netlify.app/og-image.png" />
```

### JSON-LD (optional, included)

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Ceko's Camping Checklist",
  "url": "https://palatki.netlify.app/",
  "description": "Phone-friendly camping packing checklist with progress tracking.",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "Any"
}
```

Embedded in `<script type="application/ld+json">` in `index.html`.

## PWA Manifest Alignment

**File:** `public/site.webmanifest`

| Field | Current | New |
|---|---|---|
| `name` | Camping | Ceko's Camping Checklist |
| `short_name` | Camp | Palatki |

(`short_name` kept short for home-screen label; "Palatki" matches domain.)

## robots.txt

**File:** `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://palatki.netlify.app/sitemap.xml
```

**File:** `public/sitemap.xml` — single URL entry for homepage (minimal; no routes in SPA).

## Netlify Deployment

- No `netlify.toml` changes required unless build command already custom
- Ensure build runs `pnpm run build` (triggers `prebuild` → OG generation)
- After deploy, validate:
  - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
  - [Twitter Card Validator](https://cards-dev.twitter.com/validator) (or X equivalent)
  - iMessage link preview on iOS

**Cache note:** Social platforms cache OG images aggressively. Use debugger "Scrape Again" after deploy.

## Files Changed (expected)

```
scripts/generate-og-image.mjs     (new)
public/og-image.png               (generated)
public/index.html                 (meta tags)
public/site.webmanifest           (names)
public/robots.txt                 (new)
public/sitemap.xml                (new)
package.json                      (prebuild script, sharp devDependency)
```

## Testing

### Automated
- `node scripts/generate-og-image.mjs` exits 0; PNG exists at 1200×630
- `pnpm run build` succeeds

### Manual
- View page source on deployed site — all meta tags present with absolute URLs
- Share link in iMessage/Slack — shows title, description, branded image
- Lighthouse SEO audit — description and document title pass

## Success Criteria

- [ ] Sharing https://palatki.netlify.app/ shows branded image, title, and description
- [ ] OG image matches app warm outdoors theme
- [ ] Manifest name aligned with app branding
- [ ] No Netlify Functions or stack migration required
