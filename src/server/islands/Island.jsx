'use server';

import React from 'react';
import { serializePropsForAttr } from '../../shared/serialize.js';

/**
 * Server-side wrapper that renders an island placeholder and marks it with
 * module + hydration metadata. The actual component code is resolved via the
 * server-side allowlist and hydrated later by the client runtime.
 *
 * @param {object} opts
 * @param {string} opts.islandKey - Lookup key for resolveIslandModule.
 * @param {"visible"|"idle"|"interaction"|"immediate"} [opts.hydrate="visible"] - When the client should hydrate.
 * @param {any} [opts.props] - Props to JSON-serialize and pass to the island entry.
 * @param {Function} opts.resolveIslandModule - (islandKey) => module specifier or null to stay SSR-only.
 * @param {React.ReactNode} [opts.children] - SSR fallback markup used before hydration.
 */
export const Island = ({
	islandKey,
	hydrate = 'visible', // "idle" | "interaction" | "immediate"
	props,
	children,
	resolveIslandModule, // (islandKey) => moduleSpecifier|null
}) => {
	if (typeof resolveIslandModule !== 'function') {
		throw new Error('Island requires resolveIslandModule(islandKey) to be provided.');
	}

	const moduleSpecifier = resolveIslandModule(islandKey);

	// No module = SSR-only. This is intentional for SEO.
	if (!moduleSpecifier) {
		return <>{children || null}</>;
	}

	const serialized = serializePropsForAttr(props);

	return (
		<div
			data-island-module={moduleSpecifier}
			data-hydrate={hydrate}
			data-props={serialized}
			suppressHydrationWarning={true}
		>
			{children || null}
		</div>
	);
};
