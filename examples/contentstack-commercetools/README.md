# Contentstack + Commercetools

This is the most production-like example in the repo.

It combines:

- Contentstack for page/content data
- commercetools for products, search, and cart
- SSR routes with hydrated islands
- the shared design system and shell theme integration

## Run It

From `examples/`:

```bash
npm run dev:contentstack-commercetools
```

Open `http://localhost:3003`.

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

## Required Settings

Contentstack:

```bash
CONTENTSTACK_API_KEY=your-api-key
CONTENTSTACK_DELIVERY_TOKEN=your-delivery-token
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=gcp-na
```

Commercetools:

```bash
CT_PROJECT_KEY=your-project-key
CT_CLIENT_ID=your-client-id
CT_CLIENT_SECRET=your-client-secret
CT_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
CT_API_URL=https://api.europe-west1.gcp.commercetools.com
```

## Env Loading

This exampleloads:

1. `examples/.env`
2. `examples/.env.contentstack-commercetools` if present

## Fallback Notes

The content layer is tolerant of bad or missing Contentstack config.

If Contentstack returns the known stack-not-found error, the server logs:

`[contentstack-commercetools] Contentstack stack cannot be found. Check CONTENTSTACK_API_KEY.`

and uses built-in fallback content instead of crashing the request.

## Files To Read

- `server/index.js`
- `routes/apiRoutes.js`
- `models/contentstack.model.js`
- `models/product.model.js`
- `models/search.model.js`
- `src/app/routes/index.route.jsx`
- `src/app/routes/products.route.jsx`
- `src/app/routes/products/[sku].route.jsx`

## What To Verify Here

- mixed CMS + commerce data flow
- PDP and list pages using live commerce data
- homepage content fallback when CMS is unavailable
- full islands flow in a multi-system setup
