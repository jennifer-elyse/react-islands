import React from 'react';

const mergeProps = (base, next) => ({ ...(base || {}), ...(next || {}) });

export const loadAndCompose = async ({ req, params, layouts, route }) => {
	const ctx = { req, params };

	let props = {};

	for (const L of layouts) {
		if (L.loader) props = mergeProps(props, await L.loader(ctx));
	}

	if (route.loader) props = mergeProps(props, await route.loader(ctx));

	let head = {};
	for (const L of layouts) {
		if (L.head) head = mergeProps(head, await L.head(props, ctx));
	}
	if (route.head) head = mergeProps(head, await route.head(props, ctx));

	let element = React.createElement(route.Page, { ...props, req });

	for (let i = layouts.length - 1; i >= 0; i--) {
		const L = layouts[i];
		element = React.createElement(L.Layout, { ...props, req }, element);
	}

	return { element, props, head };
};
