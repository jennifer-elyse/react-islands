// @ts-check

import React from 'react';
import { escapeJsonForInlineScript } from '../serialize.js';

const THEME_MODE_CHANGE_EVENT = 'ri:theme-mode-change';

const readCookie = (req, name) => {
	const raw = req?.headers?.cookie;
	if (!raw || typeof raw !== 'string') return null;

	const pairs = raw.split(';');
	for (const pair of pairs) {
		const [key, ...rest] = pair.trim().split('=');
		if (key !== name) continue;
		return decodeURIComponent(rest.join('='));
	}

	return null;
};

const unique = (values = []) => [...new Set(values.filter(Boolean))];

const normalizePreference = (value, allowed, fallback) => (allowed.includes(value) ? value : fallback);

const serializeConfig = (config) => escapeJsonForInlineScript(JSON.stringify(config));

const buildThemeModeScript = (config) => `
(() => {
	const config = ${serializeConfig(config)};
	const root = document.documentElement;
	const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

	const readCookie = () => {
		const prefix = config.cookieName + '=';
		const match = document.cookie
			.split(';')
			.map((part) => part.trim())
			.find((part) => part.startsWith(prefix));
		return match ? decodeURIComponent(match.slice(prefix.length)) : null;
	};

	const writeCookie = (value) => {
		document.cookie = config.cookieName + '=' + encodeURIComponent(value) + '; path=/; max-age=31536000; samesite=lax';
	};

	const normalize = (value) => config.allowedPreferences.includes(value) ? value : config.defaultPreference;

	const resolveMode = (preference) => {
		if (preference !== 'auto') return preference;
		if (media && media.matches && config.allowedModes.includes('dark')) return 'dark';
		return config.fallbackMode;
	};

	const updateButtons = () => {
		document.querySelectorAll('[data-theme-mode-value]').forEach((node) => {
			const value = node.getAttribute('data-theme-mode-value');
			const active = value === root.getAttribute(config.preferenceAttribute);
			node.setAttribute('aria-pressed', active ? 'true' : 'false');
			node.setAttribute('data-active', active ? 'true' : 'false');
		});
	};

	const updateThemeColor = (mode) => {
		const content = config.themeColors[mode];
		if (!content) return;
		const meta = document.querySelector('meta[name="theme-color"]');
		if (meta) meta.setAttribute('content', content);
	};

	const apply = (nextPreference, { persist = true } = {}) => {
		const preference = normalize(nextPreference);
		const mode = resolveMode(preference);
		root.setAttribute(config.preferenceAttribute, preference);
		root.setAttribute(config.attribute, mode);
		updateThemeColor(mode);

		if (persist) {
			try {
				window.localStorage.setItem(config.storageKey, preference);
			} catch {}
			writeCookie(preference);
		}

		updateButtons();
		window.dispatchEvent(new CustomEvent(config.changeEventName, {
			detail: { preference, mode },
		}));
		return { preference, mode };
	};

	const getStoredPreference = () => {
		try {
			const stored = window.localStorage.getItem(config.storageKey);
			if (stored) return stored;
		} catch {}
		return readCookie();
	};

	const bootstrap = () => {
		const initialPreference = normalize(
			getStoredPreference() ||
			root.getAttribute(config.preferenceAttribute) ||
			config.defaultPreference,
		);
		apply(initialPreference, { persist: false });
	};

	bootstrap();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', updateButtons, { once: true });
	} else {
		updateButtons();
	}

	document.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const button = target.closest('[data-theme-mode-value]');
		if (!button) return;

		const value = button.getAttribute('data-theme-mode-value');
		if (!config.allowedPreferences.includes(value)) return;

		event.preventDefault();
		apply(value);
	});

	if (media) {
		const handleSystemChange = () => {
			const preference = normalize(
				getStoredPreference() ||
				root.getAttribute(config.preferenceAttribute) ||
				config.defaultPreference,
			);
			if (preference === 'auto') apply('auto', { persist: false });
		};

		if (typeof media.addEventListener === 'function') media.addEventListener('change', handleSystemChange);
		else if (typeof media.addListener === 'function') media.addListener(handleSystemChange);
	}

	window.__RI_THEME_MODE__ = {
		apply,
		getPreference: () => root.getAttribute(config.preferenceAttribute),
		getMode: () => root.getAttribute(config.attribute),
		changeEventName: config.changeEventName,
	};
})();
`;

/**
 * @typedef {import('../../../types/ssr/index.d.ts').ThemeModeFeatureOptions} ThemeModeFeatureOptions
 */

/**
 * Installs SSR document attrs plus a tiny client script that keeps a
 * light/dark/auto preference in sync with the DOM, localStorage, and cookies.
 *
 * @param {ThemeModeFeatureOptions} options
 */
export const createThemeModeFeature = ({
	attribute = 'data-theme-mode',
	preferenceAttribute = 'data-theme-mode-preference',
	storageKey = 'ri-theme-mode',
	cookieName = 'ri_theme_mode',
	allowedModes = ['light', 'dark'],
	allowAuto = false,
	fallbackMode = 'light',
	defaultPreference = allowAuto ? 'auto' : fallbackMode,
	themeColors = {},
} = {}) => {
	const normalizedAllowedModes = unique(allowedModes);
	const allowedPreferences = allowAuto ? unique([...normalizedAllowedModes, 'auto']) : normalizedAllowedModes;
	const normalizedFallbackMode = normalizedAllowedModes.includes(fallbackMode) ? fallbackMode : normalizedAllowedModes[0] || 'light';
	const normalizedDefaultPreference = normalizePreference(defaultPreference, allowedPreferences, allowAuto ? 'auto' : normalizedFallbackMode);

	return {
		name: 'theme-mode',
		getDocumentProps({ req }) {
			const preference = normalizePreference(
				readCookie(req, cookieName),
				allowedPreferences,
				normalizedDefaultPreference,
			);
			const initialMode = preference === 'auto' ? normalizedFallbackMode : preference;
			const script = buildThemeModeScript({
				attribute,
				preferenceAttribute,
				storageKey,
				cookieName,
				allowedModes: normalizedAllowedModes,
				allowedPreferences,
				fallbackMode: normalizedFallbackMode,
				defaultPreference: normalizedDefaultPreference,
				themeColors,
				changeEventName: THEME_MODE_CHANGE_EVENT,
			});

			return {
				htmlAttrs: {
					[attribute]: initialMode,
					[preferenceAttribute]: preference,
				},
				meta: themeColors[initialMode]
					? [{ name: 'theme-color', content: themeColors[initialMode] }]
					: [],
				headPrefix: [
					React.createElement('script', {
						key: 'ri-theme-mode-script',
						id: 'ri-theme-mode-script',
						dangerouslySetInnerHTML: { __html: script },
					}),
				],
			};
		},
	};
};
