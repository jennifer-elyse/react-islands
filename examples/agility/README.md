# Agility

This example is the Agility-flavored CMS examplefor `react-islands-runtime`.

It uses:

- Agility-style content models from `models/agility.model.js`
- local surf-shop fixture data for search and cart
- the shared exampleshell and design system from `examples/_shared`

## Run It

From `examples/`:

```bash
npm run dev:agility
```

Open `http://localhost:3002`.

## What This ExampleCovers

- SSR page rendering
- file-based routes
- hydrated search and cart islands
- CMS-style content loading without requiring commercetools
- shared shell/theme integration

## Main Routes

- `/`
- `/content`

## API Routes

- `/api/status`
- `/api/search`
- `/api/search/suggestions`
- `/api/cart`
- `/api/content/home`
- `/api/content/hero`

## Files To Read

- `server/index.js`
- `routes/apiRoutes.js`
- `models/agility.model.js`
- `src/app/routes/_layout.route.jsx`
- `src/app/routes/index.route.jsx`

## Environment

This exampleloads:

1. `examples/.env`
2. `examples/.env.agility` if present

No vendor credentials are required for the local fixture path.

## When To Use This

Use this one when you want to verify:

- a CMS-shaped integration
- shared islands behavior
- theme/document-props rendering

without depending on a live commerce backend.
