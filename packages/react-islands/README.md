# react-islands

Reusable UI components for apps built on `react-islands-runtime`.

## Packages

- `react-islands-runtime`: SSR runtime, islands runtime, manifest helpers, routing, and design-system APIs
- `react-islands`: reusable UI components that sit on top of the runtime

## Carousel Setup

`CarouselBlock` expects the app to expose a local island entry at:

`/src/islands/Carousel.entry.jsx`

The simplest entry file is:

```js
export { default } from 'react-islands/carousel';
```

That keeps the runtime manifest flow app-owned while letting the carousel UI live in this package.
