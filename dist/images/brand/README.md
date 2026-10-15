# FRCC Brand Logo Files

This directory contains the official FRCC (Film Recreation & Cultural Centre) logo assets.

## Expected Files

### 1. `frcc-emblem.png` (and `frcc-emblem.webp`)
- The circular emblem only (navy ring with gold film reel, dome, waves, and "FRCC" center)
- Transparent background
- Tightly cropped to the circle boundary
- Approximately 512px square at 1x resolution
- Retina/2x version: `frcc-emblem@2x.png` (or `frcc-emblem-2x.png`)

### 2. `frcc-logo-full.png`
- The full logo: emblem + "FRCC" wordmark + tagline
- Transparent background
- Approximately 800px wide at 1x resolution
- Retina/2x version: `frcc-logo-full@2x.png`

### 3. `favicon.png` / `favicon.ico`
- The emblem at 32px
- The emblem at 64px
- Apple touch icon at 180px (`apple-touch-icon.png`)

### 4. `frcc-emblem.svg` (preferred)
- Vector version of the circular emblem for infinite scalability
- Preferred for header and footer use
- If SVG is available, PNG/webp versions are generated from it

### 5. `frcc-logo-full.svg` (preferred)
- Vector version of the full logo
- Preferred for print receipts and large displays

## Quality Requirements

- **Sharp on high-density screens**: Provide 1x and 2x versions (use `srcset`)
- **Explicit width/height**: Set on all `<img>` elements to avoid layout shift
- **Eager loading**: Logos are above the fold, use `loading="eager"`
- **Circle shape**: Emblem must keep 1:1 aspect ratio, never squashed
- **Check at**: 1920, 1440, 768, and 380 pixel widths

## Notes

- The PDF source (`FRCC_logo_111.pdf`) has a black background. 
- If the background cannot be made transparent cleanly, keep the emblem inside a clean circle crop so the black only appears inside the round badge.
- The circular emblem must maintain its aspect ratio at all sizes.
- SVG is the preferred format for the emblem due to scalability.
- The full logo (`frcc-logo-full.png`) is used on printed receipts at the top of the page.

## Generation

If you have the `FRCC_logo_111.pdf` file, use ImageMagick or similar:
```
magick convert -transparent black FRCC_logo_111.pdf -alpha frcc-emblem.png
# Or for SVG trace:
magick convert FRCC_logo_111.pdf frcc-emblem.svg
```

Or use a tool like Adobe Illustrator, Affinity Designer, or an online PDF-to-PNG converter with transparent background options.