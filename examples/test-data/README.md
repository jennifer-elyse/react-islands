# Test Data

This is the fully local example.

It uses:

- local content fixtures
- local product fixtures
- local search fixtures
- the shared SSR shell, design system, and islands runtime

No vendor credentials are required.

## Run It

From `examples/`:

```bash
npm run dev:test-data
```

Open `http://localhost:3004`.

## Why This ExampleExists

Use this example when you want a dependable smoke test for:

- SSR rendering
- route composition
- islands hydration
- search behavior
- cart behavior
- styling/theme output
- local image and static asset serving

without involving Contentstack, commercetools, or Agility.

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
- `/api/content/home`
- `/api/content/hero`
- `/api/products`
- `/api/products/:sku`

## Files To Read

- `server/index.js`
- `routes/apiRoutes.js`
- `models/content.model.js`
- `models/product.model.js`
- `models/search.model.js`
- `src/app/routes/_layout.route.jsx`
- `src/app/routes/index.route.jsx`
- `src/app/routes/products.route.jsx`
- `src/app/routes/products/[sku].route.jsx`

## Current UX Shape

The homepage is the beach/surf-themed fixture exampleand includes:

- a liquid-glass themed hero
- local surf products
- search island
- mini-cart island

Static images for this exampleare served from:

`examples/_shared/public/images`

## Recommended Use

Start with this exampleif:

- you are changing the runtime package itself
- you want to verify the local tarball in `examples/package.json`
- you need a stable repro for SSR or styling issues

If this examplebreaks, the problem is usually in the runtime or shared example plumbing rather than an external vendor integration.
