# react-islands-runtime

`react-islands-runtime` is an SSR-first React islands runtime plus a set of working example apps.

This repo has two jobs:

1. Provide the runtime package in `src/`, `packages/`, and `types/`
2. Prove the runtime against concrete e-commerce-style demos in `examples/`

## What You Can Run

From `examples/`, these are the current demo commands:

```bash
yarn dev:commercetools              # http://localhost:3000
yarn dev:contentstack               # http://localhost:3001
yarn dev:agility                    # http://localhost:3002
yarn dev:contentstack-commercetools # http://localhost:3003
yarn dev:test-data                  # http://localhost:3004
```

Each `dev:*` command does three things:

1. Kills any old server using the demo port or Vite port `5173`
2. Builds the client bundle and islands manifest
3. Starts Vite plus the matching Express demo server

## Quick Start

```bash
git clone <repo>
cd react-islands-runtime
yarn install
cd examples
yarn install
yarn dev:test-data
```

Open `http://localhost:3004`.

`test-data-demo` is the best first run because it needs no vendor credentials.

## Repo Layout

- `src/client` client islands runtime
- `src/server` SSR render, router, theme, CSS, manifest, and security helpers
- `packages/ssr` public SSR entrypoint
- `packages/islands` public client/islands entrypoint
- `packages/rsc` public RSC-facing entrypoint
- `types` TypeScript declarations for the published package
- `examples/_shared` shared demo server, design system, runtime helpers, and fixture data
- `examples/*-demo` concrete example apps

## Runtime Entry Points

The package currently exposes:

- `react-islands-runtime/ssr`
- `react-islands-runtime/islands`
- `react-islands-runtime/rsc`

The examples in this repo currently consume the local tarball:

`examples/package.json` points to `file:../builds/react-islands-runtime-0.3.0.tgz`

## Environment Files

The shared demo server loads env files in this order:

1. `examples/.env`
2. `examples/.env.<demo>` when `DEMO_TARGET` is set
3. `./.env` from the current working directory

That means `yarn dev:contentstack-commercetools` will try to load:

- `examples/.env`
- `examples/.env.contentstack-commercetools`

## Demo Summary

### `commercetools-demo`

- Real commercetools product/search/cart path
- Shared local content fixtures
- Best for testing commerce integration

### `contentstack-demo`

- Contentstack-backed content path
- Shared local product/cart/search fixtures
- Falls back to built-in demo content if Contentstack is missing or invalid

### `agility-demo`

- Agility-flavored content example
- Shared local product/cart/search fixtures
- Good for seeing a CMS-driven variant without external commerce

### `contentstack-commercetools-demo`

- Contentstack for content
- commercetools for catalog/search/cart
- Closest to a real multi-system storefront setup

### `test-data-demo`

- Local fixture content
- Local fixture products
- No third-party credentials
- Best smoke test for routing, SSR, islands, search, cart, and styling

## Common Routes

Most demos expose these page routes:

- `/`
- `/products`
- `/products/:sku`

Most demos expose these API routes:

- `/api/search`
- `/api/search/suggestions`
- `/api/cart`
- `/api/cart/items`

Some demos also expose content-oriented endpoints such as:

- `/api/content/home`
- `/api/content/hero`
- `/api/status`

## Build Notes

The examples client build is:

```bash
cd examples
yarn build:client
```

That script:

1. updates the service worker cache name in `examples/_shared/public/sw.js`
2. runs the Vite client build
3. generates `dist/client/islands-manifest.json` with `react-islands-gen-manifest`

## Packaging The Runtime

To rebuild the local tarball used by the examples:

```bash
yarn pack --filename builds/react-islands-runtime-0.3.0.tgz
```

If you refresh the tarball, also refresh the examples install so the demos pick up the new runtime code.

## Current Expectations

- Node `>= 22`
- Yarn classic works for the examples in this repo
- The examples are intentionally JS-first, even though the runtime ships TypeScript declarations

## Recommended First Checks

If a demo looks unstyled or broken:

1. restart the demo after any tarball/runtime change
2. rerun `cd examples && yarn build:client`
3. verify the example is using the local tar in `examples/package.json`
4. check the matching example README below for env and fallback behavior
