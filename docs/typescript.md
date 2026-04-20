# TypeScript Guide

This package is JS-first, but it ships a real TypeScript surface for the SSR APIs.

The goal is good DX in the places that matter most:

- theme authoring
- document props
- render features
- route loader and head contracts
- island props serialization entrypoints

It does not yet provide full end-to-end route prop inference the way a compiler-backed framework might. The current model is:

1. strong typing for the public runtime building blocks
2. preserved literal types for helpers like `defineTheme()` and `defineThemes()`
3. predictable contracts for loaders, heads, document props, and render features

## What Is Type-Safe Today

### Themes preserve your shape

`defineTheme()` and `defineThemes()` are identity helpers, which means TypeScript keeps the exact object shape you give them.

```ts
import { defineTheme, defineThemes } from 'react-islands-runtime/ssr';

const beachTheme = defineTheme({
	name: 'beach',
	colorScheme: 'light',
	themeColor: '#dff7f6',
	tokens: {
		surface: {
			canvas: '#f8fffe',
			panel: 'rgba(255,255,255,0.8)',
		},
		radius: {
			card: '24px',
		},
	},
	documentProps: {
		htmlAttrs: { 'data-theme': 'beach' },
	},
});

const themes = defineThemes({
	beach: beachTheme,
	surf: defineTheme({
		name: 'surf',
		tokens: {
			surface: { accent: '#7de3e1' },
		},
	}),
});
```

Why this is useful:

- your keys are preserved instead of widened away immediately
- `documentProps` is checked against the public document contract
- `colorScheme` is constrained to sensible values

### Render features have a typed contract

The feature hook API is a good place to centralize request-scoped behavior.

```ts
import {
	createCssService,
	type RenderFeature,
	type RenderRequestContext,
	type ThemeDefinition,
} from 'react-islands-runtime/ssr';

type ThemeContext = RenderRequestContext & {
	css: ReturnType<typeof createCssService>;
	theme: ThemeDefinition | null;
	storeCode: string;
};

export const storeFeature: RenderFeature<
	{ css: ReturnType<typeof createCssService>; theme: ThemeDefinition | null; storeCode: string },
	Record<string, unknown>,
	ThemeContext
> = {
	name: 'store',
	extendRequestContext({ req }) {
		const css = createCssService();
		return {
			css,
			theme: null,
			storeCode: 'us',
		};
	},
	getDocumentProps({ context }) {
		return {
			htmlAttrs: { 'data-store': context.storeCode },
			styles: [{ id: 'store-base', cssText: ':root { --store-code: us; }' }],
		};
	},
};
```

Why this is type-safe:

- `getDocumentProps()` is checked to return valid `DocumentProps`
- the context extension has a concrete shape
- you can carry typed request-scoped values through the render pipeline

### Islands can carry typed props

The `Island` component accepts a generic props shape.

```tsx
import { Island, resolveIslandModule } from 'react-islands-runtime/ssr';

type SearchIslandProps = {
	placeholder: string;
	initialQuery?: string;
};

<Island<SearchIslandProps>
	islandKey="product_search"
	hydrate="immediate"
	props={{ placeholder: 'Search products...', initialQuery: 'fins' }}
	resolveIslandModule={resolveIslandModule}
>
	<div>Server fallback</div>
</Island>;
```

Why this helps:

- you get completion on `props`
- the object you serialize to the island has an explicit type
- changing island props becomes much less error-prone

## Recommended DX Pattern

Use named local types for each route instead of hoping inference will thread through the whole file automatically.

```ts
import type { RouteHead, RouteLoader } from 'react-islands-runtime/ssr';

type HomePageProps = {
	page: {
		title: string;
		blocks: Array<{ type: string; title?: string }>;
	};
};

type HomeContext = {
	req: unknown;
	params: Record<string, string>;
	storeCode: string;
};

export const loader: RouteLoader<HomePageProps, HomeContext> = async (ctx) => {
	return {
		page: {
			title: `Store ${ctx.storeCode}`,
			blocks: [{ type: 'hero', title: 'Welcome' }],
		},
	};
};

export const head: RouteHead<HomePageProps, HomeContext> = (props) => ({
	title: props.page.title,
});
```

This is currently the cleanest way to get:

- typed loader return values
- typed `head()` props
- typed custom request context

## Why The API Is Safe In Practice

These parts of the public API are constrained enough to catch real mistakes:

- `DocumentProps` only accepts the known SSR document fields
- `ThemeDefinition` narrows the theme contract
- `RenderFeature` distinguishes request-context extension from document mutation
- `Island` constrains hydration mode and allows typed island props
- `createFileRouter()` and `loadAndCompose()` now expose structured router/match result types

## Current Limits

There are still a few places where the library is intentionally lightweight:

- route-to-page prop inference is not automatic
- request and response objects are framework-agnostic, so they stay broadly typed
- route modules are discovered from files at runtime, so path params are still string-based

That means the best DX today comes from combining the runtime types with explicit local route prop types.

## Copy-Paste Starter

```ts
import type {
	DocumentProps,
	RouteHead,
	RouteLoader,
	RenderFeature,
	RenderRequestContext,
} from 'react-islands-runtime/ssr';
import { defineTheme, createDomainThemeFeature } from 'react-islands-runtime/ssr';

type PageProps = {
	page: {
		title: string;
	};
};

type AppContext = RenderRequestContext & {
	storeCode: string;
};

export const loader: RouteLoader<PageProps, AppContext> = async (ctx) => ({
	page: { title: `Store ${ctx.storeCode}` },
});

export const head: RouteHead<PageProps, AppContext> = (props) => ({
	title: props.page.title,
});

const theme = defineTheme({
	name: 'example',
	documentProps: {
		htmlAttrs: { 'data-theme': 'example' },
	} satisfies DocumentProps,
});

export const themeFeature = createDomainThemeFeature({
	resolveTheme() {
		return theme;
	},
});
```

## Easier Design-System Setup

If you just want to hand the runtime a design system and use it, the higher-level helper is simpler:

```ts
import { createDesignSystem, defineTheme } from 'react-islands-runtime/ssr';

const theme = defineTheme({
	name: 'example',
	themeColor: '#edf7f2',
	tokens: {
		surface: { canvas: '#edf7f2' },
		text: { primary: '#143126' },
	},
	modes: {
		dark: {
			themeColor: '#101d18',
			tokens: {
				surface: { canvas: '#0d1512' },
				text: { primary: '#eafaf2' },
			},
		},
	},
});

const designSystem = createDesignSystem(theme, {
	mode: { allowAuto: true },
});

designSystem.features;
```

This keeps the lower-level APIs available for advanced cases, while giving app code a single place to define theme tokens, document styles, and mode behavior.

## Practical Recommendation

If you want the best TypeScript experience with this runtime:

1. type your route props explicitly
2. type your custom render context explicitly
3. use `defineTheme()` and `defineThemes()` for all theme objects
4. use generic `Island<Props>` declarations for interactive islands
5. keep request-specific data inside render features instead of ambient globals
