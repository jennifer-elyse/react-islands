# Shared Examples

This folder contains shared code for the demo applications under `examples/`.

## What Lives Here

- `demoServer.js`: shared Express server bootstrap used by the demo apps
- `design-system/base.js`: small shared helpers for wiring consumer-defined themes into the runtime
- `runtime/`: example runtime entrypoints used while developing the demos in this repo
- `components/`, `models/`, `demo-data/`, `public/`: shared example assets and utilities

## Design System Integration

The key idea is that `react-islands-runtime` expects the app to provide its own design system features.

- Imports from `react-islands-runtime/ssr` come from the package export surface
- Each demo defines its own design system in its local `server/designSystem.js`
- Those files show how a library consumer can define themes with `defineTheme(...)`
- `examples/_shared/design-system/base.js` shows the small shared wiring helpers around `createDomainThemeFeature(...)` and `createThemeModeFeature(...)`
- Those app-defined features are then passed into the runtime during rendering

## Design System Flow

For a demo like `examples/test-data-demo`:

1. `test-data-demo/server/index.js` imports `startDemoServer` from `examples/_shared/demoServer.js`
2. `test-data-demo/server/index.js` imports `demoFeatures` from `test-data-demo/server/designSystem.js`
3. `demoServer.js` receives those features and passes them to `loadAndCompose(...)`
4. The design system is applied at render time for the app

## Why This Matters

If you update `react-islands-runtime/ssr`, you are changing packaged runtime helpers.

If you update `examples/*-demo/server/designSystem.js`, you are changing that demo app's design system implementation, which is the same extension point library users would implement in their own app.
