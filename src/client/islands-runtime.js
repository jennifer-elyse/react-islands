'use client';

import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
const SECURITY_EVENT_URL = '/api/client-security-event';

const reportSecurityEvent = ({ event, detail = {} }) => {
	const payload = JSON.stringify({
		event,
		detail,
		path: window.location.pathname,
		timestamp: new Date().toISOString(),
	});

	try {
		if (navigator.sendBeacon) {
			const blob = new Blob([payload], { type: 'application/json' });
			navigator.sendBeacon(SECURITY_EVENT_URL, blob);
			return;
		}

		void fetch(SECURITY_EVENT_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: payload,
			keepalive: true,
		});
	} catch {
		// ignore reporting failures
	}
};

const digestSha256Base64 = async (value) => {
	if (!window.crypto?.subtle || typeof TextEncoder === 'undefined') return null;

	const bytes = new TextEncoder().encode(value);
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes);
	const hashBytes = new Uint8Array(hashBuffer);
	let binary = '';

	for (const b of hashBytes) binary += String.fromCharCode(b);

	return `sha256-${btoa(binary)}`;
};

const parseManifest = async ({ elId = 'islands-manifest', integrityAttr = 'data-integrity', reportEvent }) => {
	const el = document.getElementById(elId);
	if (!el) return { modules: {} };

	const raw = el.textContent || '{}';
	const expectedIntegrity = el.getAttribute(integrityAttr);

	if (expectedIntegrity) {
		try {
			const actualIntegrity = await digestSha256Base64(raw);
			if (actualIntegrity && actualIntegrity !== expectedIntegrity) {
				console.error('Islands manifest integrity check failed.');
				reportSecurityEvent({
					event: 'manifest_integrity_failed',
					detail: { expectedIntegrity, actualIntegrity },
				});
				console.warn('Proceeding with manifest despite integrity mismatch (fail-open mode).');
			}
		} catch (err) {
			console.error('Islands manifest integrity check errored. Proceeding in fail-open mode.');
			reportSecurityEvent({
				event: 'manifest_integrity_error',
				detail: { message: err?.message || String(err) },
			});
		}
	}

	try {
		const parsed = JSON.parse(raw);
		if (!parsed.modules) parsed.modules = {};
		return parsed;
	} catch {
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

const noop = () => {};

const onIdle = (cb) => {
	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(cb, { timeout: 2000 });
		return;
	}
	setTimeout(cb, 250);
};

const onVisible = (el, cb) => {
	if (!('IntersectionObserver' in window)) {
		cb();
		return;
	}

	const io = new IntersectionObserver((entries) => {
		for (const e of entries) {
			if (e.isIntersecting) {
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
		el.removeEventListener('click', handler, true);
		el.removeEventListener('focus', handler, true);
		el.removeEventListener('keydown', handler, true);
		run();
	};

	el.addEventListener('click', handler, true);
	el.addEventListener('focus', handler, true);
	el.addEventListener('keydown', handler, true);
};

const mountIsland = async ({ el, moduleSpecifier, props, manifest }) => {
	const resolved = manifest.modules[moduleSpecifier];
	if (!resolved) {
		reportSecurityEvent({
			event: 'island_module_missing',
			detail: { moduleSpecifier },
		});
		return;
	}

	let mod;
	try {
		mod = await import(/* @vite-ignore */ resolved);
	} catch (err) {
		console.error('Island module import failed', {
			moduleSpecifier,
			resolved,
			err,
		});
		reportSecurityEvent({
			event: 'island_import_failed',
			detail: {
				moduleSpecifier,
				resolved,
				message: err?.message || String(err),
			},
		});
		return;
	}

	const Component = mod.default;
	if (!Component && typeof mod.mount === 'function') {
		try {
			mod.mount(el, props);
		} catch (err) {
			console.error('Island mount() fallback failed', {
				moduleSpecifier,
				resolved,
				err,
			});
			reportSecurityEvent({
				event: 'island_mount_failed',
				detail: {
					moduleSpecifier,
					resolved,
					message: err?.message || String(err),
					mode: 'mount-fallback',
				},
			});
		}
		return;
	}

	if (!Component) {
		reportSecurityEvent({
			event: 'island_default_export_missing',
			detail: { moduleSpecifier, resolved },
		});
		return;
	}

	const hasSSRMarkup = el.childNodes && el.childNodes.length > 0;

	try {
		if (hasSSRMarkup) hydrateRoot(el, React.createElement(Component, props));
		else createRoot(el).render(React.createElement(Component, props));
	} catch (err) {
		console.error('Island mount failed', { moduleSpecifier, resolved, err });
		reportSecurityEvent({
			event: 'island_mount_failed',
			detail: {
				moduleSpecifier,
				resolved,
				message: err?.message || String(err),
			},
		});
	}
};

/**
 * Hydrates all islands present in the DOM. Safe to call multiple times
 * (hydration is idempotent per island module instance).
 *
 * @param {object} [opts]
 * @param {string} [opts.manifestElId='islands-manifest'] - ID of the inline manifest <script>.
 * @param {string} [opts.selector='[data-island-module]'] - Query selector for island roots.
 * @param {(err: Error, el: HTMLElement, moduleSpecifier: string) => void} [opts.onError] - Optional error hook.
 * @param {(payload: {event: string, detail?: object}) => void} [opts.reportEvent] - Optional security/telemetry reporter.
 */
export const bootIslands = async ({
	manifestElId = 'islands-manifest',
	selector = '[data-island-module]',
	onError,
	reportEvent: reportEventInput,
} = {}) => {
	const reportEvent = typeof reportEventInput === 'function' ? reportEventInput : noop;
	const manifest = await parseManifest({ elId: manifestElId, reportEvent });
	const nodes = document.querySelectorAll(selector);

	if (!nodes.length) {
		reportSecurityEvent({ event: 'islands_not_found' });
	}

	for (const el of nodes) {
		const moduleSpecifier = el.getAttribute('data-island-module');
		const hydrate = el.getAttribute('data-hydrate') || 'visible';
		const raw = el.getAttribute('data-props') || 'null';

		let props = null;
		try {
			props = JSON.parse(raw);
		} catch {
			props = null;
		}

		const start = () => {
			try {
				return mountIsland({
					el,
					moduleSpecifier,
					props,
					manifest,
					reportEvent,
				});
			} catch (err) {
				if (onError) onError(err, el, moduleSpecifier);
				else console.error('Failed to hydrate island', moduleSpecifier, err);
			}
		};

		if (hydrate === 'immediate') start();
		else if (hydrate === 'idle') onIdle(start);
		else if (hydrate === 'interaction') onInteraction(el, start);
		else onVisible(el, start);
	}
};
// Auto-boot
if (typeof document !== 'undefined') {
	if (document.readyState === 'loading')
		document.addEventListener('DOMContentLoaded', () => {
			void bootIslands();
		});
} else {
	void bootIslands();
}
