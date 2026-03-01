/**
 * Lightweight CSP middleware for Express/Koa-like frameworks. It sets a
 * restrictive default-src and allows you to pass dev origins for Vite/HMR.
 * No external dependencies.
 */
// cspMiddleware removed

/**
 * Handler for client-side security telemetry (e.g., manifest integrity failures).
 * Compatible with Express-style `(req, res)` signatures. Ensure `express.json()`
 * or equivalent body parsing runs before this handler.
 */
export const createSecurityEventHandler = ({ logger = console.warn, onEvent }) => {
	return (req, res) => {
		const { event, detail, path: pagePath, timestamp } = req.body || {};

		if (!event || typeof event !== 'string') {
			res.status(400).json({ ok: false });
			return;
		}

		const payload = {
			event,
			detail: detail || {},
			path: pagePath || req.path,
			timestamp: timestamp || new Date().toISOString(),
			ip: req.ip,
			userAgent: req.get ? req.get('user-agent') || '' : '',
		};

		try {
			logger('client-security-event', payload);
		} catch {
			/* ignore logger errors */
		}

		if (typeof onEvent === 'function') {
			try {
				onEvent(payload);
			} catch {
				/* ignore */
			}
		}

		res.status(204).end();
	};
};
