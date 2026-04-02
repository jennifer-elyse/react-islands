import React from 'react';
import { mergeDocumentProps } from '../css/mergeDocumentProps.js';

const mergeProps = (base, next) => ({ ...(base || {}), ...(next || {}) });

export const loadAndCompose = async ({ req, params, layouts, route, features = [], getDocumentProps }) => {
	const match = { params, layouts, page: route };
	let ctx = { req, params };

	for (const feature of features) {
		if (typeof feature?.extendRequestContext !== 'function') continue;
		const extension = await feature.extendRequestContext({ req, match });
		if (extension && typeof extension === 'object') ctx = { ...ctx, ...extension };
	}

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

	let documentProps = {};
	for (const feature of features) {
		if (typeof feature?.getDocumentProps !== 'function') continue;
		const patch = await feature.getDocumentProps({ req, match, props, head, context: ctx });
		if (patch) documentProps = mergeDocumentProps(documentProps, patch);
	}
	if (typeof getDocumentProps === 'function') {
		const patch = await getDocumentProps({ req, match, props, head, context: ctx });
		if (patch) documentProps = mergeDocumentProps(documentProps, patch);
	}

	return { element, props, head, documentProps, context: ctx };
};
