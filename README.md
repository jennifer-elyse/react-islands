# react-islands

This zip contains:

- `packages/react-islands`: an npm-ready library (`@jennifer-elyse/react-islands`) implementing **SSR-first React islands** with module-specifier manifests.
- `apps/example-host`: a small SSR + Vite example showing:
	- Streaming SSR (`renderToPipeableStream`)
	- File-based routing with nested layouts (`_layout.route.jsx`)
	- CMS-like blocks that stay SSR-first for SEO
	- Islands that hydrate lazily (`visible`, `idle`, `interaction`, `immediate`)
	- Production build that emits `dist/client/islands-manifest.json`

## Quick start

```bash
cd apps/example-host
yarn
yarn dev
```

- SSR server: http://localhost:3000
- Vite dev server: http://localhost:5173

## Production build

```bash
yarn build
cd apps/example-host
NODE_ENV=production yarn start
```

## Security guardrails

- The client runtime **refuses** to `import()` anything not present in `manifest.modules`.
- The server emits islands only via an allowlist resolver (`resolveIslandModule`).
- Island props are JSON-serialized and escaped for safe embedding in HTML attributes.
- The inline manifest JSON is escaped to prevent accidental HTML/script parsing.

### Recommended hardening for real deployments

- Add a CSP with nonces/hashes (the manifest script is inline).
- Validate/shape island props (e.g., with Zod) before rendering.
- Consider limiting island props size and enabling gzip/brotli at the edge.
