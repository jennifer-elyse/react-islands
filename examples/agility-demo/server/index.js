import { startDemoServer } from '../../_shared/demoServer.js';

const { default: apiRoutes } = await import('../routes/apiRoutes.js');

await startDemoServer({
	routesDir: new URL('../src/app/routes/', import.meta.url),
	apiRouter: apiRoutes,
	port: process.env.PORT || 3002,
	name: 'agility-demo',
});
