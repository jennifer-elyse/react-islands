import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";

const parseManifest = (elId = "islands-manifest") => {
	const el = document.getElementById(elId);
	if (!el) return { modules: {} };

	try
	{
		const parsed = JSON.parse(el.textContent || "{}");
		if (!parsed.modules) parsed.modules = {};
		return parsed;
	}
	catch
	{
		return { modules: {} };
	}
};

const once = (fn) => {
	let ran = false;
	return (...args) => {
		if (ran) return;
		ran = true;
		fn(...args);
	};
};

const onIdle = (cb) => {
	if ("requestIdleCallback" in window)
	{
		window.requestIdleCallback(cb, { timeout: 2000 });
		return;
	}
	setTimeout(cb, 250);
};

const onVisible = (el, cb) => {
	if (!("IntersectionObserver" in window))
	{
		cb();
		return;
	}

	const io = new IntersectionObserver((entries) => {
		for (const e of entries)
		{
			if (e.isIntersecting)
			{
				io.disconnect();
				cb();
				return;
			}
		}
	});

	io.observe(el);
};

const onInteraction = (el, cb) => {
	const run = once(cb);

	const handler = () => {
		el.removeEventListener("click", handler, true);
		el.removeEventListener("focus", handler, true);
		el.removeEventListener("keydown", handler, true);
		run();
	};

	el.addEventListener("click", handler, true);
	el.addEventListener("focus", handler, true);
	el.addEventListener("keydown", handler, true);
};

const mountIsland = async ({ el, moduleSpecifier, props, manifest }) => {
	const resolved = manifest.modules[moduleSpecifier];

	// Guardrail: only import modules present in the manifest.
	if (!resolved)
	{
		console.warn(`Island module not allowed or missing from manifest: ${moduleSpecifier}`);
		return;
	}

	const mod = await import(/* @vite-ignore */ resolved);
	const Component = mod.default;

	if (!Component)
	{
		console.warn(`Island entry has no default export: ${resolved}`);
		return;
	}

	const hasSSRMarkup = el.childNodes && el.childNodes.length > 0;

	if (hasSSRMarkup)
	{
		hydrateRoot(el, React.createElement(Component, props));
	}
	else
	{
		createRoot(el).render(React.createElement(Component, props));
	}
};

export const bootIslands = ({ manifestElId = "islands-manifest" } = {}) => {
	const manifest = parseManifest(manifestElId);
	const nodes = document.querySelectorAll("[data-island-module]");

	for (const el of nodes)
	{
		const moduleSpecifier = el.getAttribute("data-island-module");
		const hydrate = el.getAttribute("data-hydrate") || "visible";
		const raw = el.getAttribute("data-props") || "null";

		let props = null;
		try { props = JSON.parse(raw); }
		catch { props = null; }

		const start = () => mountIsland({ el, moduleSpecifier, props, manifest });

		if (hydrate === "immediate") start();
		else if (hydrate === "idle") onIdle(start);
		else if (hydrate === "interaction") onInteraction(el, start);
		else onVisible(el, start);
	}
};

// Auto-boot
if (document.readyState === "loading")
{
	document.addEventListener("DOMContentLoaded", () => bootIslands());
}
else
{
	bootIslands();
}
