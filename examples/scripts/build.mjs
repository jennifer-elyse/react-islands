import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const pkgPath = path.resolve('package.json');
const swPath = path.resolve('_shared/public/sw.js');
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
	if (!fs.existsSync(swPath)) return;
	const sw = fs.readFileSync(swPath, 'utf8');
	const pattern = /const CACHE_NAME = 'react-islands-v[^']+';/;

	if (!pattern.test(sw)) {
		throw new Error('Could not find CACHE_NAME assignment in _shared/public/sw.js');
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
		throw new Error('Local Vite binary not found. Run npm install inside examples first.');
	}

	execSync(`"${viteBin}" build --config vite.client.config.js`, {
		stdio: 'inherit',
	});
};

const runIslandsManifestCli = () => {
	const cliBin = path.resolve('node_modules/.bin/react-islands-gen-manifest');
	if (!fs.existsSync(cliBin)) {
		throw new Error(
			'Local react-islands-gen-manifest binary not found. Run npm install inside examples first.',
		);
	}

	execSync(`"${cliBin}" --in "${viteManifestPath}" --out "${outPath}"`, {
		stdio: 'inherit',
	});
};

const main = () => {
	const version = getPackageVersion();
	updateServiceWorkerCacheName(version);
	runViteBuild();
	runIslandsManifestCli();
	console.log('Client build complete.');
};

try {
	main();
} catch (err) {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
}
