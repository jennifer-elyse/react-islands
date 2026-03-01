import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const pkgPath = path.resolve('package.json');
const swPath = path.resolve('public/sw.js');
const viteManifestPath = path.resolve('dist/client/.vite/manifest.json');
const outPath = path.resolve('dist/client/islands-manifest.json');

const getPackageVersion = () => {
	const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
	const version = pkg.version;

	if (!version) throw new Error('package.json is missing a version field.');
	if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/.test(version)) {
		throw new Error(`package.json version is not valid semver: ${version}`);
	}

	return version;
};

const updateServiceWorkerCacheName = (version) => {
	const sw = fs.readFileSync(swPath, 'utf8');
	const pattern = /const CACHE_NAME = 'react-islands-v[^']+';/;

	if (!pattern.test(sw)) {
		throw new Error('Could not find CACHE_NAME assignment in public/sw.js');
	}

	const expected = `const CACHE_NAME = 'react-islands-v${version}';`;
	if (sw.includes(expected)) {
		console.log(`Service worker cache name already up to date: react-islands-v${version}`);
		return;
	}

	const next = sw.replace(pattern, expected);
	fs.writeFileSync(swPath, next, 'utf8');
	console.log(`Updated service worker cache name to react-islands-v${version}`);
};

const runViteBuild = () => {
	const viteBin = path.resolve('node_modules/.bin/vite');
	if (!fs.existsSync(viteBin)) {
		throw new Error('Local Vite binary not found. Run the install step first.');
	}

	execSync(`"${viteBin}" build --config vite.client.config.js`, {
		stdio: 'inherit',
	});
};

const toIslandKey = (src) => {
	if (!src.startsWith('src/app/islands/') || !src.includes('.entry.')) return null;

	const name = src
		.replace(/^src\/app\/islands\//, '')
		.replace(/\.entry\.(js|jsx)$/, '');

	return name
		.replace(/([a-z0-9])([A-Z])/g, '$1_$2')
		.replace(/[\s-]+/g, '_')
		.toLowerCase();
};

const toModuleSpecifier = (src) => toIslandKey(src);

const writeIslandsManifest = () => {
	const viteManifest = JSON.parse(fs.readFileSync(viteManifestPath, 'utf8'));
	const modules = {};

	for (const [key, rec] of Object.entries(viteManifest)) {
		const moduleSpecifier = toModuleSpecifier(key);
		if (!moduleSpecifier) continue;

		modules[moduleSpecifier] = `/${rec.file}`;
	}

	let runtimeFile = null;
	for (const [key, rec] of Object.entries(viteManifest)) {
		if (key === 'src/client/islands-runtime.entry.js') {
			runtimeFile = `/${rec.file}`;
			break;
		}
	}

	if (!runtimeFile) {
		throw new Error(
			"Could not find runtime entry 'src/client/islands-runtime.entry.js' in Vite manifest.",
		);
	}

	const islandsManifest = {
		modules,
		'islands-runtime': runtimeFile,
	};

	fs.writeFileSync(outPath, JSON.stringify(islandsManifest, null, '\t'), 'utf8');
	console.log(`Wrote ${outPath}`);
};

const main = () => {
	const version = getPackageVersion();
	updateServiceWorkerCacheName(version);
	runViteBuild();
	writeIslandsManifest();
	console.log('Client build complete.');
};

try {
	main();
} catch (err) {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
}
