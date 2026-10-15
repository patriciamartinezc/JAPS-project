---
name: my-brand
description: JAPS brand guidelines (colour palette, typography, spacing, buttons, cards, logo rules and tone of voice) taken from the JAPS clothing website. Use this whenever you create or edit JAPS pages, components, emails, copy, slides or any other on-brand material, or when someone asks what the JAPS brand looks or sounds like.
---

# JAPS brand

JAPS is a small clothing label: everyday clothing made to last. It is designed in Madrid and sewn in Portugal. Its look is warm, editorial and calm: cream paper, a single strong house pink, a serif for headlines and a clean geometric sans for everything else.

The source of truth is `japs.css` (tokens in its `:root` block), `japs-logo.css` and `japs-logo.svg`. If this file and the CSS ever disagree, the CSS wins. Update this skill to match it.

## 1. Colour palette

Always use the CSS custom properties. Never hard-code hex values in new CSS.

| Token          | Hex       | Use |
|----------------|-----------|-----|
| `--pink`       | `#C2185B` | House pink, taken from the logo. Links, `<strong>`, prices, list markers, heading rules, primary buttons, focus rings |
| `--pink-dark`  | `#961346` | Hover/focus state for pink links and buttons |
| `--pink-tint`  | `#FCEBF1` | Very light wash for callouts (`aside`) and image placeholders |
| `--cream`      | `#EFE6D8` | Logo cream. Text on pink or plum backgrounds |
| `--ink`        | `#2B2118` | Body text and headings. Warm near-black, never pure `#000` |
| `--ink-soft`   | `#6B5E52` | Captions, taglines, labels, `h4` eyebrows |
| `--page`       | `#FBF7F3` | Page background, and the fill inside form inputs |
| `--card`       | `#FFFFFF` | Cards, forms, header background |
| `--line`       | `#E6DCCF` | 1px hairline borders |
| `--plum`       | `#2A1119` | Footer background |

Other values used on the site:
- `#F7B8CE`: light pink, used only for footer link hover on plum.
- `rgba(194, 24, 91, 0.35)`: link underline colour (pink at 35%).
- `rgba(194, 24, 91, 0.15)`: input focus halo (pink at 15%).
- `rgba(239, 230, 216, 0.4)`: footer link underline (cream at 40%).

Colour rules:
- Pink is the **only** accent. Do not add a second accent colour (no blues, greens and so on). Product colour names like "sand" or "deep navy" describe the garments and are not UI colours.
- Pink is used sparingly, for emphasis and action. Large areas are cream/white, and the only dark band is the plum footer.
- On dark grounds (pink or plum), text is `--cream`, not white.
- All neutrals are warm (brown/beige undertones). Do not introduce cool greys.

## 2. Typography

Loaded from Google Fonts:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400&family=Jost:wght@300;400;500;600&display=swap">
```

| Token     | Stack | Use |
|-----------|-------|-----|
| `--serif` | `"Playfair Display", Georgia, "Times New Roman", serif` | `h1`-`h3`, and `<em>` (italic serif inside sans body text) |
| `--sans`  | `"Jost", system-ui, -apple-system, "Segoe UI", Arial, sans-serif` | Body, nav, labels, buttons, `h4`, footer |

Type scale:
- **Body:** Jost, `1.0625rem` (17px), line-height `1.65`, colour `--ink`. Drops to `1rem` under 480px.
- **h1:** Playfair 700, `clamp(2rem, 5vw, 2.75rem)`, letter-spacing `-0.01em`, line-height `1.2`.
- **h2:** Playfair 700, `1.6rem` (`1.35rem` under 480px). In `main`, every h2 gets a short pink rule underneath: 48 × 3px, `--pink`, radius 2px, `0.6rem` above it.
- **h3:** Playfair 700, `1.2rem`. Used for card and product titles.
- **h4 (eyebrow):** Jost 600, `0.8rem`, UPPERCASE, letter-spacing `0.12em`, `--ink-soft`.
- **Paragraphs:** `max-width: 68ch`, bottom margin `1rem`.
- **`<strong>`:** weight 600 in `--pink`. Use it for the single most important fact in a paragraph.
- **`.price`:** weight 600, `--pink`, `white-space: nowrap`. Format prices as `89&nbsp;€`: number, non-breaking space, euro sign after the number.

Small-caps UI pattern: nav links, labels, buttons and footer links are all small (0.78–0.85rem), UPPERCASE Jost with wide tracking (0.1–0.14em).

## 3. Spacing and layout

- Page content: `main` is centred, `max-width: 1120px`, with padding `clamp(1.5rem, 4vw, 3rem)` vertical and `clamp(1rem, 4vw, 3rem)` horizontal. The header and footer use the same horizontal clamp.
- Sections: CSS grid `repeat(auto-fit, minmax(300px, 1fr))`, gap `1.5rem`, `margin-bottom: 3rem`. Only `article`s flow into columns. Everything else (headings, text, lists, banner images) spans the full row. Below 768px the grid collapses to one column.
- Rhythm: `0.35rem` between list items, `1rem` paragraph gap, `1.25rem` card padding, `1.5rem` grid/form padding, `3rem` between sections.
- Radius: `--radius: 10px` for cards, forms, callouts and banner images. `6px` for inputs and images inside cards. `999px` (pill) for buttons.
- Shadows: `--shadow: 0 1px 3px rgba(43,33,24,0.06)` at rest, `--shadow-lift: 0 10px 24px rgba(43,33,24,0.12)` on hover. Shadows are tinted with ink, not black.
- Breakpoints: `768px` (header stacks, grid becomes one column) and `480px` (smaller body/h2, card images 180px).
- Anchor targets: `scroll-margin-top: 1.5rem`, with smooth scrolling.

## 4. Buttons

Primary button (the only button style on the site):

```css
padding: 0.75rem 2.25rem;
font-family: inherit;            /* Jost */
font-size: 0.85rem;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;
color: var(--cream);
background-color: var(--pink);
border: none;
border-radius: 999px;            /* pill */
transition: background-color 0.18s ease, transform 0.18s ease;
/* hover */      background-color: var(--pink-dark); transform: translateY(-1px);
/* focus-visible */ outline: 2px solid var(--ink); outline-offset: 3px;
```

If you need a secondary action, use a pink text link instead of a second button style.

**Links:** `--pink`, underline at 35% pink with `text-underline-offset: 3px`. On hover/focus they turn `--pink-dark` with a full-colour underline. Focus-visible: 2px pink outline, offset 3px.

**Nav links:** `--ink`, 0.8rem, weight 500, uppercase, tracking 0.14em, no underline. On hover/focus they turn pink and get a 2px pink bottom border.

## 5. Cards and surfaces

**Card (`article`)**: used for every product or store.
- Background `--card`, `1px solid var(--line)` border, `--radius` (10px), `--shadow`, padding `1.25rem`, `height: 100%` so cards in a row match.
- Hover: `translateY(-3px)` and `--shadow-lift`, 0.18s ease.
- Structure: `h3` title, then image, then description paragraph with `.price`, then optional `h4` eyebrow + list, then optional link.
- Card image: full width, 210px tall, `object-fit: cover`, radius 6px, `--pink-tint` placeholder background.
- Product photos (`img.product-photo`): square (`aspect-ratio: 1/1`), `object-fit: contain` on white. **The garment is never cropped.**
- Full-length studio shots add `.portrait`: a 3:4 frame whose leftover space is filled with the photo's own backdrop colour, given per image as `style="--photo-bg: #EBE7E4"` (read it from the photo's side edges).
- Rows come out even: a section with four cards shows them 2 × 2, and one with five shows a row of three and then a row of two wider cards (handled in `japs.css`, no extra classes needed).

**Banner images** directly inside a section: full width, `clamp(220px, 32vw, 360px)` tall, cover, 10px radius. Collages (`img.collage`) keep a 5:3 ratio with `contain` and are never cropped.

**Callout (`aside`)**: `--pink-tint` background, `4px solid var(--pink)` left border, 10px radius, padding `1.25rem 1.5rem`. Its h2 is `1.15rem` with no pink rule underneath. Use it for tangential help (sizing, returns, restocks).

**Forms**: a white card (same border/radius/shadow), padding `1.5rem`, max-width 440px. Labels are small uppercase `--ink-soft` (0.78rem, 600, tracking 0.1em) above the input. Inputs fill with `--page`, have a 1px `--line` border and 6px radius, and on focus get a pink border plus a `0 0 0 3px` pink halo at 15%. Checkboxes use `accent-color: var(--pink)`.

**Header**: white, 1px `--line` bottom border. Logo lockup on the left, nav on the right, italic `--ink-soft` tagline on its own line underneath.

**Footer**: `--plum` band, centred `--cream` text at 0.9rem. Links are uppercase 0.8rem with a cream 40% underline, and turn `#F7B8CE` on hover.

**Motion**: transitions are quick (0.15–0.18s ease) and small (lifts of 1–3px). Always honour `prefers-reduced-motion`: no smooth scroll, no transitions, no hover lifts.

## 6. Logo rules

The logo (`japs-logo.svg`, 120×120 viewBox) is a **sewn-in garment label**:
- A rounded square in house pink `#C2185B` (rx 24).
- A dashed cream `#EFE6D8` stitch line inset 10 units (rx 16, stroke 2.5, dash `5 8`, round caps, 85% opacity).
- The four founders' initials **J A / P S** in a 2×2 grid, cream, bold sans, all the same size and weight. No letter is ever made bigger or a different colour, because each one stands for a founder.

Usage:
- Only use the logo in its pink-and-cream colours. Do not recolour, outline, stretch, rotate, add effects or remove the stitching.
- Always keep it square (`flex-shrink: 0` in flex layouts).
- **Lockup:** `.brand` is a flex row with the logo beside the page `h1`, vertically centred, `gap: 1rem`, h1 margin 0. Logo size is 96px by default and 64px in the site header and on screens under 480px.
- **Alt text:** if the `h1` next to it already says "JAPS" (homepage), use `alt=""` to avoid repetition. On every other page the logo is the only brand name, so use `alt="JAPS"`.
- The same SVG is the favicon: `<link rel="icon" href="japs-logo.svg">`.
- The wordmark is always written **JAPS**, in capitals, with no dots or spaces.

## 7. Tone of voice

JAPS writes like a small workshop talking to a customer: **plain, specific, honest and quietly confident.**

Principles:
- **Concrete facts over adjectives.** Name the fabric, weight, origin and number: "100% washed linen, 190 gsm", "12 oz cotton canvas", "40 units per size", "spun from Spanish merino wool in Catalonia". Avoid words like "premium", "luxurious" or "iconic".
- **First person plural, direct address.** "We design and pattern the garment in Madrid." "Bring a worn piece into any of our stores and we will mend it while you wait."
- **Transparent and a little blunt.** State policies flatly, including what JAPS does *not* do: "We never discount." "We do not run waiting lists." "We do not use social media for customer service." "Thirty days, worn or unworn, no questions."
- **Practical help.** Give the reader something they can act on: "Our shirts run one size large on purpose. If you are between two sizes, take the smaller one." "We answer every message within one working day."
- **Small human details.** "Wrinkles included." "The entrance is the door on the left." "The pattern room is behind the fitting rooms and you are welcome to look in."
- **No hype or urgency tricks.** No exclamation marks, emoji, ALL-CAPS shouting or "Hurry!" copy. Scarcity is stated as a fact ("sizes sell out quickly").
- **Durability and care** come up again and again: free repairs for life, small batches, remaking unsold stock in a new colour instead of destroying it.

Mechanics:
- Product names use "The" + garment: *The Linen Overshirt*, *The Work Trouser*, *The Silk Camisole*.
- Headings are sentence case and plain: "New in this week", "How we make our clothes", "Not sure about your size?".
- Short declarative sentences. Contractions are rare ("we will", "do not").
- Prices are written `89 €` (non-breaking space, euro after the number). Times use 24h (`10:00 - 20:30`).
- Taglines: "Everyday clothing made to last." / "Designed in Madrid, sewn in Portugal."
- Links say where they go ("Browse the full collection", "Jump to the autumn photographs"), never "click here".

## 8. Checklist for new JAPS work

1. Link `japs-logo.css` then `japs.css`, plus the Google Fonts link above.
2. Use semantic HTML (`header`, `nav` with `aria-current="page"`, `main`, `section`, `article`, `aside`, `footer`) so the existing styles apply without extra classes.
3. Colours come from tokens only. Pink is the single accent.
4. Serif for h1–h3, Jost for everything else. UI labels are small, uppercase and widely tracked.
5. Cards are white with a hairline border, 10px radius and a soft lift on hover. Product photos are never cropped.
6. Buttons are pink pills with cream uppercase text.
7. The logo is unaltered, square, and has the correct alt text.
8. Copy is specific, honest, first person plural, with no hype.
