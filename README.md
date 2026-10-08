# JAPS — Everyday clothing made to last

Coursework site for Web Application Programming (G247), CUNEF Escuela Politécnica Superior.

A static, multi-page site for a fictional Madrid clothing brand, built with hand-written HTML and CSS — no frameworks, no build step.

**Authors:** Jimena Gil, Ariadna Calzado, Sofía Rodríguez and Patricia Martínez

**Live site:** https://patriciamartinezc.github.io/JAPS-project/

## Pages

| File | Purpose |
|---|---|
| `index.html` | Homepage — new arrivals, autumn lookbook teaser, brand story |
| `collections.html` | Full catalogue — a category menu plus seven sections (shirts, knitwear, dresses and skirts, jackets and coats, trousers, bags, accessories) |
| `lookbook.html` | Seasonal photo sets for Autumn 2026 and Spring 2026 |
| `stores.html` | The three store locations, contact details and returns policy |
| `cart.html` | The cart — the garments picked out elsewhere, with quantities and a total |
| `login.html` | Account sign-in form and account benefits |
| `starter_practice_page.html` | Shared Session 6 CSS practice page (DevNews). Not part of the JAPS site — the markup is fixed and must not be edited. |

## Stylesheets

| File | Purpose |
|---|---|
| `japs.css` | Main stylesheet for the whole site. Defines the brand tokens (house pink `#C2185B`, cream `#EFE6D8`) and all layout. |
| `japs-logo.css` | Brand lockup only — places the logo next to the page title. Loaded *before* `japs.css`. |
| `practice-styles.css` | Styles for `starter_practice_page.html` only. |

`japs-logo.svg` is the logo, used both in the header lockup and as the favicon.

## Scripts

| File | Purpose |
|---|---|
| `japs-cart.js` | The shopping cart. Loaded with `defer` on every page of the site. |

The cart is plain hand-written JavaScript — no framework and no build step, like
the rest of the project. It keeps the cart in `localStorage` under the key
`japs-cart`, so it survives a reload and follows the visitor from page to page.
A page joins in by adding:

- a button with `class="add-to-cart"` and `data-name`, `data-price` and
  (optionally) `data-image` — one sits under every garment that has a price;
- an element with `data-cart-count` in the nav, which gets the number of items
  written into it;
- on `cart.html` only, the table with `id="cart-rows"` that the cart is drawn into.

If `localStorage` is unavailable the cart still works for as long as the tab is
open, it just stops being remembered.

Fonts (Playfair Display and Jost) are loaded from Google Fonts, so the site needs a network connection to render exactly as designed.

## How to run

Open `index.html` in a browser, or — preferably — use VS Code's Live Server extension so that relative links and the favicon resolve the same way they do on GitHub Pages.

## Status

- [x] Block I — HTML structure (all six site pages)
- [x] Block II — CSS and layout (all six pages link `japs.css`)
- [x] Cart — `cart.html` plus `japs-cart.js`, the site's only JavaScript
