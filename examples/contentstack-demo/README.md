# React Islands Contentstack Demo

This demo showcases integration of SSR, React Server Components (RSC), and React Islands using Contentstack for content. Product and cart data use the shared surf shop demo data.

## Features
- **SSR**: Server-side rendering using the SSR package
- **RSC**: (Placeholder) React Server Components integration
- **Islands**: Hydration and mounting of interactive islands

## Usage

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the demo app:
   ```sh
   yarn dev:contentstack
   ```
3. Open http://localhost:3001

## Required environment

Set these before running the demo:

```sh
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
CONTENTSTACK_ENVIRONMENT=prod
CONTENTSTACK_REGION=us
```

## Environment overrides

This demo loads `.env` plus `.env.contentstack` if present.

## Example Integration
See the demo routes and components for usage patterns:
Controllers: `controllers/` (see `routes/apiRoutes.js` for wiring)

API endpoints:
- `/api/status` — Demo status endpoint
- `/api/search` — Product search
- `/api/search/suggestions` — Typeahead suggestions
- `/api/cart` — Get cart contents
- `/api/cart/add` — Add item to cart
- `/api/content/home` — Contentstack demo landing page
- `/api/content/hero` — Contentstack demo hero banners
- `/api/products` — Commercetools demo product list
- `/api/products/:sku` — Commercetools demo product by SKU

---
For more details, see the main project README.
