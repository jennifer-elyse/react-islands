import { createManifestProvider } from '../manifest.js';

export const createHostManifestProvider = () => {
	const isDev = process.env.NODE_ENV !== 'production';
	const assetsOrigin =
		process.env.ASSETS_ORIGIN || (isDev ? 'http://localhost:5173' : undefined);

	if (isDev && assetsOrigin) {
		return createManifestProvider({
			mode: 'dev',
			devModules: {
				cart: `${assetsOrigin}/src/app/islands/Cart.entry.jsx`,
				product_search: `${assetsOrigin}/src/app/islands/ProductSearch.entry.jsx`,
			},
			runtimeDevSrc: `${assetsOrigin}/src/client/islands-runtime.entry.js`,
			extraManifestFields: { 'vite-client': `${assetsOrigin}/@vite/client` },
		});
	}

	return createManifestProvider({
		mode: 'prod',
		manifestPath: 'dist/client/islands-manifest.json',
	});
};
