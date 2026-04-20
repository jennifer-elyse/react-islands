import { createManifestProvider } from '../manifest.js';
import { getAllIslandModuleSpecifiers } from '../islands/resolveIslandModule.js';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const resolveRuntimeEntryPath = () => {
	if (process.env.RUNTIME_ENTRY_PATH) {
		return path.resolve(process.env.RUNTIME_ENTRY_PATH);
	}
	try {
		return require.resolve('react-islands-ui/client/islands-runtime.entry.js');
	} catch {
		return path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../client/islands-runtime.entry.js');
	}
};

export const createHostManifestProvider = () => {
	const isDev = process.env.NODE_ENV !== 'production';
	const assetsOrigin = process.env.ASSETS_ORIGIN || (isDev ? 'http://localhost:5173' : undefined);

	if (isDev && assetsOrigin) {
		const devModules = {};
		for (const spec of getAllIslandModuleSpecifiers()) {
			devModules[spec] = `${assetsOrigin}${spec}`;
		}

		return createManifestProvider({
			mode: 'dev',
			devModules,
			runtimeDevSrc: `${assetsOrigin}/@fs${resolveRuntimeEntryPath()}`,
			extraManifestFields: { 'vite-client': `${assetsOrigin}/@vite/client` },
		});
	}

	return createManifestProvider({
		mode: 'prod',
		manifestPath: 'dist/client/islands-manifest.json',
	});
};
