"use client";

const noop = () => {};

const trackInstalling = (registration, { onCached = noop, onUpdated = noop }) => {
	const listener = (worker) => {
		if (!worker) return;
		worker.addEventListener("statechange", () => {
			if (worker.state === "installed")
			{
				if (navigator.serviceWorker.controller) onUpdated(registration);
				else onCached(registration);
			}
		});
	};

	listener(registration.installing);
	registration.addEventListener("updatefound", () => listener(registration.installing));
};

/**
 * Registers a service worker. Safe to call multiple times; silently no-ops
 * when unsupported. Supports callbacks for lifecycle events.
 *
 * Example:
 * import { registerServiceWorker } from "@jennifer.elyse/react-islands/client/pwa-register";
 * registerServiceWorker({
 *   onUpdated: () => alert("New version available"),
 *   onCached: () => console.info("App cached for offline use"),
 * });
 */
export const registerServiceWorker = async ({
	url = "/sw.js",
	scope = "/",
	onRegistered = noop,
	onCached = noop,
	onUpdated = noop,
	onError = noop,
} = {}) => {
	if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return { registered: false };

	try
	{
		const registration = await navigator.serviceWorker.register(url, { scope });
		onRegistered(registration);
		trackInstalling(registration, { onCached, onUpdated });
		return { registered: true, registration };
	}
	catch (err)
	{
		onError(err);
		console.warn("Service worker registration failed", err);
		return { registered: false, error: err };
	}
};

// Optional convenience: auto-register when imported directly in the browser
if (typeof window !== "undefined")
{
	registerServiceWorker().catch(() => {});
}
