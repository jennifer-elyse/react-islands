import { startServer } from '../../_shared/demoServer.js';
import { demoFeatures } from './designSystem.js';

const { default: apiRoutes } = await import('../routes/apiRoutes.js');

await startServer({
	routesDir: new URL('../src/app/routes/', import.meta.url),
	apiRouter: apiRoutes,
	features: demoFeatures,
	port: Number(process.env.PORT) || 3003,
	name: 'contentstack-commercetools',
});
