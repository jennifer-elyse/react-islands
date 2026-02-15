"use client";

import { registerServiceWorker } from "./pwa-register.js";

const defaultTheme = {
	background: "linear-gradient(135deg, #0ea5e9, #22c55e 60%, #f472b6)",
	text: "#0b132b",
	accent: "#0f172a",
};

const createStyles = ({ theme }) => {
	if (document.getElementById("pwa-toast-styles")) return;
	const style = document.createElement("style");
	style.id = "pwa-toast-styles";
	style.textContent = `
		.pwa-toast-shell{position:fixed;z-index:2147483647;bottom:16px;right:16px;display:flex;gap:12px;align-items:center;max-width:360px;border-radius:14px;padding:12px 14px;box-shadow:0 12px 30px rgba(0,0,0,0.18);color:${theme.text};background:${theme.background};backdrop-filter: blur(6px);font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;}
		.pwa-toast-emoji{font-size:26px;filter: drop-shadow(0 2px 4px rgba(0,0,0,0.18));}
		.pwa-toast-content{flex:1;min-width:0;}
		.pwa-toast-title{font-weight:700;font-size:15px;margin:0 0 4px;display:flex;align-items:center;gap:6px;}
		.pwa-toast-body{margin:0;font-size:14px;line-height:1.45;}
		.pwa-toast-actions{display:flex;gap:8px;margin-left:auto;}
		.pwa-toast-btn{border:none;border-radius:10px;padding:8px 10px;font-weight:700;font-size:13px;cursor:pointer;color:#fff;background:${theme.accent};box-shadow:0 2px 6px rgba(0,0,0,0.16);}
		.pwa-toast-btn.ghost{background:rgba(255,255,255,0.2);color:${theme.accent};}
		@media (max-width: 520px){.pwa-toast-shell{left:12px;right:12px;bottom:12px;}}
	`;
	document.head.appendChild(style);
};

const createToast = ({ theme, emoji }) => {
	createStyles({ theme });
	let hideTimer = null;

	const shell = document.createElement("div");
	shell.className = "pwa-toast-shell";
	shell.style.display = "none";

	const icon = document.createElement("div");
	icon.className = "pwa-toast-emoji";
	icon.textContent = emoji;

	const content = document.createElement("div");
	content.className = "pwa-toast-content";
	const titleEl = document.createElement("div");
	titleEl.className = "pwa-toast-title";
	const bodyEl = document.createElement("div");
	bodyEl.className = "pwa-toast-body";
	content.append(titleEl, bodyEl);

	const actions = document.createElement("div");
	actions.className = "pwa-toast-actions";

	shell.append(icon, content, actions);
	document.body.appendChild(shell);

	const hide = () => {
		shell.style.display = "none";
		titleEl.textContent = "";
		bodyEl.textContent = "";
		actions.replaceChildren();
		if (hideTimer) clearTimeout(hideTimer);
	};

	const show = ({ title, message, actionLabel, onAction, duration = 8000 }) => {
		shell.style.display = "flex";
		titleEl.textContent = title;
		bodyEl.textContent = message;

		actions.replaceChildren();
		if (actionLabel && typeof onAction === "function")
		{
			const btn = document.createElement("button");
			btn.className = "pwa-toast-btn";
			btn.textContent = actionLabel;
			btn.addEventListener("click", () => {
				onAction();
				hide();
			});
			actions.appendChild(btn);
		}

		const close = document.createElement("button");
		close.className = "pwa-toast-btn ghost";
		close.textContent = "Dismiss";
		close.addEventListener("click", hide);
		actions.appendChild(close);

		if (hideTimer) clearTimeout(hideTimer);
		hideTimer = setTimeout(hide, duration);
	};

	return { show, hide };
};

/**
 * Registers the service worker and shows a kawaii tropical toast when
 * the PWA is ready offline, updated, or fails.
 */
export const installPwaToast = ({
	emoji = "🏝️🌺🍍",
	theme = defaultTheme,
	url,
	scope,
} = {}) => {
	if (typeof window === "undefined") return;

	const toast = createToast({ theme, emoji });

	registerServiceWorker({
		url,
		scope,
		onCached: () => toast.show({ title: "Ready offline", message: "Your islands are cached. Enjoy the sunshine!" }),
		onUpdated: () => toast.show({ title: "Fresh tide arrived", message: "A new island build is ready.", actionLabel: "Reload", onAction: () => window.location.reload() }),
		onError: () => toast.show({ title: "Oops, rough seas", message: "Couldn’t dock the service worker. Try again later." }),
	});
};