/**
 * Lightweight CSP middleware for Express/Koa-like frameworks. It sets a
 * restrictive default-src and allows you to pass dev origins for Vite/HMR.
 * No external dependencies.
 */
export const cspMiddleware = ({ devOrigin, allowInlineScriptsInDev = true } = {}) => {
	return (req, res, next) => {
		const isDev = process.env.NODE_ENV !== "production";
		const origin = devOrigin || (isDev ? process.env.ASSETS_ORIGIN || "http://localhost:5173" : "");
		const wsOrigin = origin ? origin.replace(/^http/, "ws") : "";

		const directives = [
			"default-src 'self'",
			"base-uri 'self'",
			"object-src 'none'",
			"frame-ancestors 'none'",
			`script-src 'self'${isDev && origin ? ` ${origin}${allowInlineScriptsInDev ? " 'unsafe-inline'" : ""}` : ""}`,
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: https:",
			"font-src 'self' data:",
			`connect-src 'self' https:${isDev && origin ? ` ${origin}${wsOrigin ? ` ${wsOrigin}` : ""}` : ""}`,
			"manifest-src 'self'",
			"worker-src 'self'",
		];

		res.setHeader("Content-Security-Policy", directives.join("; "));
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.setHeader("Referrer-Policy", "no-referrer");
		res.setHeader("X-Frame-Options", "DENY");

		next();
	};
};

/**
 * Handler for client-side security telemetry (e.g., manifest integrity failures).
 * Compatible with Express-style `(req, res)` signatures. Ensure `express.json()`
 * or equivalent body parsing runs before this handler.
 */
export const createSecurityEventHandler = ({
	logger = console.warn,
	onEvent,
}) => {
	return (req, res) => {
		const { event, detail, path: pagePath, timestamp } = req.body || {};

		if (!event || typeof event !== "string")
		{
			res.status(400).json({ ok: false });
			return;
		}

		const payload = {
			event,
			detail: detail || {},
			path: pagePath || req.path,
			timestamp: timestamp || new Date().toISOString(),
			ip: req.ip,
			userAgent: req.get ? (req.get("user-agent") || "") : "",
		};

		try { logger("client-security-event", payload); }
		catch { /* ignore logger errors */ }

		if (typeof onEvent === "function")
		{
			try { onEvent(payload); }
			catch { /* ignore */ }
		}

		res.status(204).end();
	};
};
