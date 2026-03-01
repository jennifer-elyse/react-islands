import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

import dotenv from 'dotenv';

import { cspMiddleware, createFileRouter, loadAndCompose, renderPage } from 'react-islands-runtime/ssr';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const examplesRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(__dirname, '../..');
const sharedPublicRoot = path.join(__dirname, 'public');

const envPathFromRoot = path.join(examplesRoot, '.env');
const envPathFromCwd = path.join(process.cwd(), '.env');
const demoTarget = process.env.DEMO_TARGET || null;
const demoEnvPath = demoTarget ? path.join(examplesRoot, `.env.${demoTarget}`) : null;

const loadEnv = (envPath) => {
	if (!fs.existsSync(envPath)) return false;
	dotenv.config({ path: envPath, override: true });
	return true;
};

const loadedFromRoot = loadEnv(envPathFromRoot);
const loadedFromCwd = loadEnv(envPathFromCwd);
const loadedFromDemo = demoEnvPath ? loadEnv(demoEnvPath) : false;

if (process.env.NODE_ENV !== 'production') {
	console.log('[demo] env files:', {
		projectRoot: envPathFromRoot,
		loadedFromRoot,
		demoEnvPath,
		loadedFromDemo,
		cwd: envPathFromCwd,
		loadedFromCwd,
		examplesRoot,
		repoRoot,
	});
}

const hasContentstackEnv = Boolean(process.env.CONTENTSTACK_API_KEY && process.env.CONTENTSTACK_DELIVERY_TOKEN);

export const startDemoServer = async ({ routesDir, apiRouter, port = 3000, name = 'demo' }) => {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use((req, _res, next) => {
		req.session ||= {};
		next();
	});
	app.use(cspMiddleware);

	// Static: public assets
	if (fs.existsSync(sharedPublicRoot)) {
		app.use(express.static(sharedPublicRoot, { maxAge: '1h' }));
	}
	app.use(express.static(path.join(examplesRoot, 'public'), { maxAge: '1h' }));

	if (process.env.NODE_ENV === 'production') {
		app.use(
			'/assets',
			express.static(path.join(examplesRoot, 'dist/client/assets'), {
				immutable: true,
				maxAge: '1y',
			}),
		);
		app.use(express.static(path.join(examplesRoot, 'dist/client'), { maxAge: '1h' }));
	}

	app.use('/api', apiRouter);

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

	const router = await createFileRouter({ routesDir });

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

	app.listen(port, () => {
		console.log(`react-islands ${name} listening on http://localhost:${port}`);
		if (!hasContentstackEnv && name === 'contentstack-demo') {
			console.warn('[contentstack-demo] Missing CONTENTSTACK_API_KEY or CONTENTSTACK_DELIVERY_TOKEN in env.');
		}
	});

	return app;
};
