# react-islands-runtime

`react-islands-runtime` is an SSR-first React islands runtime plus a set of working example apps.

This repo has two jobs:

1. Provide the runtime package in `src/`, `packages/`, and `types/`
2. Prove the runtime against concrete e-commerce-style demos in `examples/`

## What You Can Run

From `examples/`, these are the current examplecommands:

```bash
yarn dev:commercetools              # http://localhost:3000
yarn dev:contentstack               # http://localhost:3001
yarn dev:agility                    # http://localhost:3002
yarn dev:contentstack-commercetools # http://localhost:3003
yarn dev:test-data                  # http://localhost:3004
```

Each `dev:*` command does three things:

1. Kills any old server using the exampleport or Vite port `5173`
2. Builds the client bundle and islands manifest
3. Starts Vite plus the matching Express exampleserver

In development, server-side changes now live reload too:

- `nodemon` watches both the active examplefolder and `examples/_shared`
- the Express exampleserver exposes a dev-only boot id endpoint at `/__server_reload__`
- the HTML document polls that endpoint and refreshes the browser when the server process restarts

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

`test-data` is the best first run because it needs no vendor credentials.

## Repo Layout

- `src/client` client islands runtime
- `src/server` SSR render, router, theme, CSS, manifest, and security helpers
- `packages/ssr` public SSR entrypoint
- `packages/islands` public client/islands entrypoint
- `packages/rsc` public RSC-facing entrypoint
- `packages/react-islands` reusable components package
- `types` TypeScript declarations for the published package
- `examples/_shared` shared exampleserver, design system, runtime helpers, and fixture data
- `examples/*` concrete example apps

## Runtime Entry Points

The package currently exposes:

- `react-islands-runtime/ssr`
- `react-islands-runtime/islands`
- `react-islands-runtime/rsc`

## Design Systems

Apps can hand the runtime a single theme-backed design system and get the right render features back:

```js
import { createDesignSystem, defineTheme } from 'react-islands-runtime/ssr';

const theme = defineTheme({
	name: 'storefront',
	themeColor: '#edf7f2',
	tokens: {
		surface: { canvas: '#edf7f2', panel: '#fbfffd' },
		text: { primary: '#143126' },
	},
	documentProps: {
		styles: [{ id: 'app-shell', cssText: 'body { margin: 0; }' }],
	},
	modes: {
		dark: {
			themeColor: '#101d18',
			tokens: {
				surface: { canvas: '#0d1512', panel: '#14221d' },
				text: { primary: '#eafaf2' },
			},
		},
	},
});

export const { features } = createDesignSystem(theme, {
	mode: { allowAuto: true },
});
```

That `features` array can be passed straight into `loadAndCompose(...)` or `createRenderRequest(...)`.

## Shared Carousel Scrollbar

The shared carousel rail now uses a visible styled horizontal scrollbar with a glassy thumb treatment in:

- [examples/\_shared/design-system/base.js](/Users/jkirchne/node_projects/react-islands-runtime/examples/_shared/design-system/base.js:750)

That styling is applied to `.carousel__scroller`, which means it is inherited by every examplehomepage carousel rendered through:

- [packages/react-islands/src/components/CarouselBlock.jsx](/Users/jkirchne/node_projects/react-islands-runtime/packages/react-islands/src/components/CarouselBlock.jsx:1)
- [examples/\_shared/homepageBlocks.js](/Users/jkirchne/node_projects/react-islands-runtime/examples/_shared/homepageBlocks.js:45)

Current exampleroutes using that shared carousel path:

- [examples/commercetools/src/app/routes/index.route.jsx](/Users/jkirchne/node_projects/react-islands-runtime/examples/commercetools/src/app/routes/index.route.jsx:48)
- [examples/contentstack/src/app/routes/index.route.jsx](/Users/jkirchne/node_projects/react-islands-runtime/examples/contentstack/src/app/routes/index.route.jsx:67)
- [examples/agility/src/app/routes/index.route.jsx](/Users/jkirchne/node_projects/react-islands-runtime/examples/agility/src/app/routes/index.route.jsx:55)
- [examples/contentstack-commercetools/src/app/routes/index.route.jsx](/Users/jkirchne/node_projects/react-islands-runtime/examples/contentstack-commercetools/src/app/routes/index.route.jsx:163)
- [examples/test-data/src/app/routes/index.route.jsx](/Users/jkirchne/node_projects/react-islands-runtime/examples/test-data/src/app/routes/index.route.jsx:79)

TypeScript usage guide:

- [docs/typescript.md](/Users/jkirchne/node_projects/react-islands-runtime/docs/typescript.md)

This repo now has two package surfaces:

- `react-islands-runtime`: runtime, SSR helpers, manifest tooling, router helpers, and design-system APIs
- `react-islands`: reusable UI components built on top of the runtime

The examples in this repo currently consume both local packages:

- `react-islands-runtime` from `file:../builds/react-islands-runtime-0.3.0.tgz`
- `react-islands` from `file:../packages/react-islands`

## Environment Files

The shared exampleserver loads env files in this order:

1. `examples/.env`
2. `examples/.env.<example>` when `EXAMPLE_TARGET` is set
3. `./.env` from the current working directory

That means `yarn dev:contentstack-commercetools` will try to load:

- `examples/.env`
- `examples/.env.contentstack-commercetools`

## ExampleSummary

### `commercetools`

- Real commercetools product/search/cart path
- Shared local content fixtures
- Best for testing commerce integration

### `contentstack`

- Contentstack-backed content path
- Shared local product/cart/search fixtures
- Falls back to built-in examplecontent if Contentstack is missing or invalid

### `agility`

- Agility-flavored content example
- Shared local product/cart/search fixtures
- Good for seeing a CMS-driven variant without external commerce

### `contentstack-commercetools`

- Contentstack for content
- commercetools for catalog/search/cart
- Closest to a real multi-system storefront setup

### `test-data`

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

To pack the component library, run `npm pack` from `packages/react-islands/`.

## Current Expectations

- Node `>= 22`
- Yarn classic works for the examples in this repo
- The examples are intentionally JS-first, even though the runtime ships TypeScript declarations

## Recommended First Checks

If a examplelooks unstyled or broken:

1. restart the exampleafter any tarball/runtime change
2. rerun `cd examples && yarn build:client`
3. verify the example is using the local tar in `examples/package.json`
4. check the matching example README below for env and fallback behavior
