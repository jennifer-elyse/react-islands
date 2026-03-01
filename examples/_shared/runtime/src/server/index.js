import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { cspMiddleware } from './security/csp.js';
import { createFileRouter } from './router/fileRouter.js';
import { loadAndCompose } from './render/composeRoute.js';
import { renderPage } from './render/renderPage.js';

import { createCmsClient, verifyCmsConnection } from './sdk/contentstack.js';
import apiRoutes from '../../routes/apiRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Minimal session stub to avoid undefined access; replace with real session store as needed.
app.use((req, _res, next) => {
	req.session ||= {};
	next();
});
app.use(cspMiddleware);

// Static: public (works in dev and prod)
app.use(express.static(path.join(__dirname, '../../public'), { maxAge: '1h' }));

// Prod: built client assets
if (process.env.NODE_ENV === 'production') {
	app.use(
		'/assets',
		express.static(path.join(__dirname, '../../dist/client/assets'), {
			immutable: true,
			maxAge: '1y',
		}),
	);
	app.use(express.static(path.join(__dirname, '../../dist/client'), { maxAge: '1h' }));
}

// Attach clients (adapters). If env is missing, client is null.
app.use((req, res, next) => {
	try {
		req.cms = createCmsClient();
	} catch {
		req.cms = null;
	}
	next();
});

app.use('/api', apiRoutes);

app.post('/api/client-security-event', (req, res) => {
	const { event, detail, path: pagePath, timestamp } = req.body || {};

	if (!event || typeof event !== 'string') {
		return res.status(400).json({ ok: false });
	}

	console.warn('client-security-event', {
		event,
		detail: detail || {},
		path: pagePath || req.path,
		timestamp: timestamp || new Date().toISOString(),
		ip: req.ip,
		userAgent: req.get('user-agent') || '',
	});

	return res.status(204).end();
});

const router = await createFileRouter({
	routesDir: new URL('../app/routes/', import.meta.url),
});

app.get('*', async (req, res) => {
	try {
		const match = router.match(req.path);
		if (!match) return res.status(404).send('Not Found');

		const { element, head } = await loadAndCompose({
			req,
			params: match.params,
			layouts: match.layouts,
			route: match.page,
		});

		await renderPage({ req, res, appElement: element, head });
	} catch (err) {
		console.error('Error handling request:', err);
		res.status(500).send('Server Error');
	}
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`react-islands listening on http://localhost:${port}`);

	// Run once on boot so connection issues are visible immediately in logs
	// instead of surfacing later as request-time errors.
	void verifyCmsConnection().then((result) => {
		if (result.ok) {
			console.log('[Content-Stack], CMS connection check: SUCCESS');
			return;
		}

		console.warn('[Content-Stack], CMS connection check: FAILED', {
			message: result.error || 'Unknown CMS startup error',
			name: result.errorInfo?.name || null,
			code: result.errorInfo?.code || null,
			status: result.errorInfo?.status || null,
			raw: result.errorInfo?.raw || null,
		});
	});
});
