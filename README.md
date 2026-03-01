# react-islands demo

An SSR-first React islands playground that serves a small e-commerce experience:

- Home with search and cart islands
- Product detail pages with image, price, and add-to-cart form
- Products listing that returns the first 20 products
- Real commercetools-backed search/cart APIs (with graceful fallbacks)

## Getting started

```bash
yarn
yarn dev
# visits: http://localhost:3000
```

## Demo apps

Contentstack demo:

```bash
yarn dev:contentstack
# visits: http://localhost:3001
```

Commercetools demo:

```bash
yarn dev:commercetools
# visits: http://localhost:3000
```

Agility demo:

```bash
yarn dev:agility
# visits: http://localhost:3002
```

Contentstack + Commercetools demo:

```bash
yarn dev:contentstack-commercetools
# visits: http://localhost:3003
```

Dev runs Vite (client) and the Express server with automatic port cleanup. Prod build:

```bash
yarn build:client
yarn start
```

## Runtime packaging

This repo publishes the conceptual runtime as separate entry points (no UI components):

- `react-island-runtime/ssr`
- `react-island-runtime/islands`
- `react-island-runtime/rsc`

To test locally with the examples, pack and install the tarball (uses semver filename):

```bash
yarn pack --filename builds/react-island-runtime-0.1.15.tgz
yarn --cwd examples add file:../builds/react-island-runtime-0.1.15.tgz
```

Examples import SSR helpers from the package (e.g. `react-island-runtime/ssr`).

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
- commercetools creds (see `.env.example` if present)

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
```

## Project structure

- `src/app/routes` file-based routes (layouts + pages)
- `src/app/islands` SSR + client entry points
- `src/client` islands runtime entry
- `src/server` SSR runtime (router, renderer, manifest provider)
- `controllers` / `models` commerce and CMS adapters

## Notes

- Server imports use ESM with `.js` extensions; the build emits to `dist/`.
- Islands manifest is generated during `yarn build:client` from Vite output.
- The add-to-cart form posts to `/api/cart/items` and respects existing session cart.
