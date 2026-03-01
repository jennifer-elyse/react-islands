# React Islands Agility Demo

This demo showcases integration of SSR, React Server Components (RSC), and React Islands using Agility CMS instead of Contentstack. Product and cart data use the shared surf shop demo data.

## Features
- **SSR**: Server-side rendering using the SSR package
- **RSC**: (Placeholder) React Server Components integration
- **Islands**: Hydration and mounting of interactive islands
- **Agility CMS**: Demo content endpoints backed by Agility (mock fallback)

## Usage

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the demo app:
   ```sh
   yarn dev:agility
   ```
3. Open http://localhost:3002

## Environment overrides

This demo loads `.env` plus `.env.agility` if present.

## Example Integration
See the demo routes, controllers, and components for usage patterns:
Controllers: `controllers/` (see `routes/apiRoutes.js` for wiring)

API endpoints:
- `/api/status` — Demo status endpoint
- `/api/search` — Product search
- `/api/search/suggestions` — Typeahead suggestions
- `/api/cart` — Get cart contents
- `/api/cart/add` — Add item to cart
- `/api/content/home` — Agility demo landing page
- `/api/content/hero` — Agility demo hero banners

---
For more details, see the main project README.
