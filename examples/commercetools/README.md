# Commercetools

This example exercises the commerce side of `react-islands-runtime`.

It uses:

- commercetools-backed product, search, and cart models
- local shared content fixtures for homepage copy
- SSR page routes plus hydrated search/cart islands

## Run It

From `examples/`:

```bash
npm run dev:commercetools
```

Open `http://localhost:3000`.

## Main Routes

- `/`
- `/products`
- `/products/:sku`

## API Routes

- `/api/status`
- `/api/search`
- `/api/search/suggestions`
- `/api/cart`
- `/api/cart/items`
- `/api/products`
- `/api/products/:sku`

## Required Commerce Settings

Set these in `examples/.env` or `examples/.env.commercetools`:

```bash
CT_PROJECT_KEY=your-project-key
CT_CLIENT_ID=your-client-id
CT_CLIENT_SECRET=your-client-secret
CT_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
CT_API_URL=https://api.europe-west1.gcp.commercetools.com
```

Optional shared settings:

```bash
CART_CURRENCY=USD
DEFAULT_LOCALE=en-US
```

## Files To Read

- `server/index.js`
- `routes/apiRoutes.js`
- `models/product.model.js`
- `models/search.model.js`
- `src/app/routes/index.route.jsx`
- `src/app/routes/products.route.jsx`
- `src/app/routes/products/[sku].route.jsx`

## What To Verify Here

- real product list loading
- PDP rendering
- search suggestions
- cart API behavior
- island hydration against live commerce data

If you want the same storefront shape without third-party credentials, use `test-data` instead.
