# react-islands demo

An SSR-first React islands playground plus the `react-islands-runtime` package. The demos serve a small e-commerce experience:

- Home with search and cart islands
- Product detail pages with image, price, and add-to-cart form
- Products listing that returns the first 20 products
- Real commercetools-backed search/cart APIs (with graceful fallbacks)

## Getting started

Prereqs: Node >= 22 and Yarn.

## Demo apps (standalone)

Examples are self-contained. Run them from the `examples` workspace:

```bash
cd examples
yarn install
yarn dev:contentstack
# visits: http://localhost:3001
```

Other demos:

```bash
yarn dev:commercetools              # http://localhost:3000
yarn dev:agility                    # http://localhost:3002
yarn dev:contentstack-commercetools # http://localhost:3003
```

Dev runs Vite (client) and the Express server with automatic port cleanup. For a production-like run, build the client assets and start a demo server:

```bash
yarn build:client
NODE_ENV=production node contentstack-demo/server/index.js
```

## Runtime packaging

This repo publishes the conceptual runtime as separate entry points (no UI components):

- `react-islands-runtime/ssr`
- `react-islands-runtime/islands`
- `react-islands-runtime/rsc`

## Key routes

- `/` home with search and mini-cart islands
- `/products` first 20 products
- `/product/:sku` product detail with add-to-cart form
- `/api/search`, `/api/search/suggestions` for the typeahead
- `/api/cart` and `/api/cart/items` for cart island and PDP form

## Configuration

Environment variables (optional but recommended):

- `CART_CURRENCY` (default `USD`)
- `DEFAULT_LOCALE` (default `en-US`)
- `USE_DEMO_DATA` (set to `true` to use demo data instead of commercetools)
- commercetools creds
- Contentstack creds (contentstack demos only)

### .env example

```
# Core
CART_CURRENCY=USD
DEFAULT_LOCALE=en-US

# Demo data
USE_DEMO_DATA=true

# Commercetools
CT_PROJECT_KEY=your-project-key
CT_CLIENT_ID=your-client-id
CT_CLIENT_SECRET=your-client-secret
CT_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
CT_API_URL=https://api.europe-west1.gcp.commercetools.com

# Contentstack (optional)
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
CONTENTSTACK_ENVIRONMENT=prod
CONTENTSTACK_REGION=us
```

The demo server loads `examples/.env` and, when `DEMO_TARGET` is set, `examples/.env.<demo>` if present.

## Project structure

- `examples/*/src/app/routes` file-based routes (layouts + pages)
- `examples/*/src/app/islands` SSR + client entry points
- `src/client` islands runtime entry
- `src/server` SSR runtime (router, renderer, manifest provider)
- `examples/*/controllers` / `examples/*/models` commerce and CMS adapters

## Notes

- Server imports use ESM with `.js` extensions; the build emits to `dist/`.
- Islands manifest is generated during `yarn build:client` from Vite output.
- The add-to-cart form posts to `/api/cart/items` and respects existing session cart.
