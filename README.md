# react-island-runtime

SSR-first React islands you can drop into any server-rendered app. Ships server helpers (router, renderer, HTML shell, manifest builder) and a tiny client runtime that hydrates lazily (`visible`, `idle`, `interaction`, or `immediate`).

**Build output:** All server modules are emitted as `.js` files in `dist/server`. Ensure all imports reference `.js` extensions (not `.jsx`).

**SSR error handling:** All loader/head accesses use optional chaining to prevent runtime errors when properties are missing.

## Install

```bash
yarn add react-island-runtime
# or
npm i react-island-runtime
```

Peer deps: `react@>=19.0.0`, `react-dom@>=19.0.0`.

## Quick start (Vite example)

1) **Server: map CMS keys to island modules**

```js
// src/server/islandsPolicy.js
export const resolveIslandModule = (key) => ({
	filter: "/src/client/islands/Filters.entry.jsx",
	cart: "/src/client/islands/AddToCartButton.entry.jsx",
}[key] || null);

export const getAllIslandModuleSpecifiers = () => [
	"/src/client/islands/Filters.entry.jsx",
	"/src/client/islands/AddToCartButton.entry.jsx",
];
```

2) **Server: file-based router + renderer**

```js
// src/server/index.js
import express from "express";
import { createFileRouter, createRenderRequest, HtmlDocument } from "react-island-runtime/server";
import { resolveIslandModule, getAllIslandModuleSpecifiers } from "./islandsPolicy.js";

// All imports must use .js extensions:
// import { Island } from "react-island-runtime/dist/server/Island.js";

const router = await createFileRouter({ routesDir: new URL("../app/routes/", import.meta.url) });
const renderRequest = createRenderRequest({
	HtmlDocument,
	resolveIslandModule,
	getAllIslandModuleSpecifiers,
	devOrigin: process.env.VITE_DEV_ORIGIN || "http://localhost:5173",
	manifestPath: "dist/client/islands-manifest.json",
});

const app = express();
app.use(express.static("dist/client", { immutable: true, maxAge: "1y" }));
app.get("*", (req, res) => renderRequest({ req, res, router }));
app.listen(3000);
```

3) **Server: mark islands in routes**

```jsx
import React from "react";
import { Island } from "react-island-runtime/dist/server/Island.js";

export const Page = ({ sku }) => (
	<Island
		islandKey="cart"
		hydrate="interaction" // visible | idle | interaction | immediate
		props={{ sku }}
		resolveIslandModule={resolveIslandModule}
	>
		<button type="button">Add to cart</button>
	</Island>
);
```

4) **Client: import the runtime**

```js
// src/client/islands-runtime.entry.js
import "react-island-runtime/client/runtime";
```

## Migration notes

- All server imports must use `.js` extensions after build.
- Published package includes all `dist/server/*.js` files.
- SSR error handling is improved with optional chaining for loader/head accesses.

5) **Build and emit islands manifest (CLI)**

```bash
yarn build      # runs your Vite build
react-islands-gen-manifest --in dist/client/.vite/manifest.json --out dist/client/islands-manifest.json
```

## API surface

- `Island`: server component that serializes props and tags markup for hydration.
- `createFileRouter`: file-based router for `.route.jsx` files (layouts + pages).
- `createRenderRequest`: composes layouts/pages, merges `head`, and embeds the manifest/runtime.
- `HtmlDocument`: default HTML shell (manifest inline script + runtime + preload hooks).
- `createManifestProvider`: reads your manifest (prod) or accepts explicit module URLs (dev) and can emit a SHA-256 integrity string.
- `serializePropsForAttr` / `escapeJsonForInlineScript`: helpers if you need custom HTML shells.
- `bootIslands`: client runtime; auto-runs on `DOMContentLoaded`, or call manually with `{ selector, manifestElId, onError, reportEvent }`. Supports manifest integrity verification (via `data-integrity` attribute) and reports issues through `reportEvent`.
- `createSecurityEventHandler`: Express-style handler for client security telemetry (e.g., manifest integrity failures).

### Manifest integrity (optional)

If you want a defense-in-depth check for the inlined manifest, call `provider.getManifestIntegrity()` and attach it to the `<script>` as `data-integrity`. The client runtime will SHA-256 the JSON and, on mismatch, call your `reportEvent` hook.

```jsx
const provider = createManifestProvider({ mode: "prod", manifestPath: "dist/client/islands-manifest.json" });
const manifestJson = provider.getManifestJson();
const manifestIntegrity = provider.getManifestIntegrity();

<script
	id="islands-manifest"
	data-integrity={manifestIntegrity}
	type="application/json"
	dangerouslySetInnerHTML={{ __html: manifestJson }}
/>
```

### CSP and client security telemetry

Add a CSP and a POST endpoint to capture client-side security events:

```js
import express from "express";
import { cspMiddleware, createSecurityEventHandler } from "react-island-runtime/server";

const app = express();
app.use(express.json());
app.use(cspMiddleware());
app.post("/api/client-security-event", createSecurityEventHandler({ logger: console.warn }));
```

## Hydration strategies

- `visible` (default): hydrate when the island enters the viewport.
- `idle`: hydrate when the browser is idle.
- `interaction`: hydrate on first click/focus/keydown.
- `immediate`: hydrate as soon as the runtime executes.

## Security guardrails

- Client refuses to `import()` modules that are not present in the manifest.
- Server must resolve island keys via an allowlist; `null` keeps a block SSR-only.
- Props and manifest JSON are escaped to avoid breaking HTML/JS contexts.
