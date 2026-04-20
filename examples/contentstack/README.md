# Contentstack

This example exercises the content side of `react-islands-runtime`.

It uses:

- Contentstack for homepage/content models
- local/shared product, search, and cart fixtures
- SSR routes and hydrated islands

## Run It

From `examples/`:

```bash
npm run dev:contentstack
```

Open `http://localhost:3001`.

## Main Routes

- `/`
- `/products`
- `/products/:sku`

## API Routes

- `/api/status`
- `/api/search`
- `/api/search/suggestions`
- `/api/cart`
- `/api/content/home`
- `/api/content/hero`
- `/api/products`
- `/api/products/:sku`

## Contentstack Settings

Put these in `examples/.env` or `examples/.env.contentstack`:

```bash
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
CONTENTSTACK_ENVIRONMENT=prod
CONTENTSTACK_REGION=us
```

## Fallback Behavior

This exampledoes not hard-fail when Contentstack is missing or invalid.

Current behavior:

- missing credentials: falls back to built-in examplecontent
- placeholder credentials like `your-api-key`: treated as not configured
- invalid stack credentials: logs a direct stack-not-found warning and falls back

That makes this exampleuseful even before you wire up a real stack.

## Files To Read

- `server/index.js`
- `routes/apiRoutes.js`
- `models/contentstack.model.js`
- `models/search.model.js`
- `models/cart.model.js`
- `src/app/routes/index.route.jsx`

## What To Verify Here

- content fallback path
- CMS-driven homepage rendering
- SSR shell and theme output
- search/cart islands working alongside CMS content
