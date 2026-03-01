'use server';

import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { escapeJsonForInlineScript } from '../shared/serialize.js';

/**
 * Creates a manifest provider that the server can use to embed the islands
 * manifest JSON into the HTML. In dev, you supply module URLs directly; in
 * prod, it reads the JSON emitted by your bundler.
 */
export const createManifestProvider = ({
	mode, // "dev" | "prod"
	devModules, // { [moduleSpecifier]: resolvedImportTarget }
	manifestPath, // e.g. "dist/client/islands-manifest.json"
	runtimeDevSrc = '/assets/islands-runtime.js',
	includeIntegrity = true,
	extraManifestFields = {},
}) => {
	const buildPayload = (manifest) => {
		const manifestJson = escapeJsonForInlineScript(JSON.stringify(manifest));

		let manifestIntegrity = null;
		if (includeIntegrity) {
			const digest = createHash('sha256').update(manifestJson).digest('base64');
			manifestIntegrity = `sha256-${digest}`;
		}

		return { manifest, manifestJson, manifestIntegrity };
	};

	if (mode === 'dev') {
		const manifest = {
			modules: devModules || {},
			'islands-runtime': runtimeDevSrc,
			...extraManifestFields,
		};

		const payload = buildPayload(manifest);

		return {
			mode: 'dev',
			getManifest: () => payload.manifest,
			getManifestJson: () => payload.manifestJson,
			getManifestIntegrity: () => payload.manifestIntegrity,
		};
	}

	if (!manifestPath) {
		throw new Error('createManifestProvider: manifestPath is required in prod mode');
	}

	const raw = fs.readFileSync(manifestPath, 'utf8');
	const manifest = { ...JSON.parse(raw), ...extraManifestFields };

	if (!manifest.modules) {
		throw new Error('Manifest missing required key: modules');
	}

	const payload = buildPayload(manifest);

	return {
		mode: 'prod',
		getManifest: () => payload.manifest,
		getManifestJson: () => payload.manifestJson,
		getManifestIntegrity: () => payload.manifestIntegrity,
	};
};

const toModuleSpecifier = (src) => {
	if (!src.startsWith('src/app/islands/') || !src.includes('.entry.')) return null;

	const name = src.replace(/^src\/app\/islands\//, '').replace(/\.entry\.(js|jsx)$/, '');

	const ext = src.endsWith('.js') ? '.js' : '.jsx';
	return `/src/app/islands/${name}.entry${ext}`;
};

export const buildIslandsManifest = ({ viteManifestPath, outPath }) => {
	if (!fs.existsSync(viteManifestPath)) {
		throw new Error(`Vite manifest not found: ${viteManifestPath}`);
	}

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
		}
	}

	if (!runtimeFile) {
		throw new Error('Could not find runtime entry src/client/islands-runtime.entry.js in Vite manifest');
	}

	const islandsManifest = {
		modules,
		'islands-runtime': runtimeFile,
	};

	fs.writeFileSync(outPath, JSON.stringify(islandsManifest, null, '\t'), 'utf8');
	return islandsManifest;
};

export const runManifestCli = () => {
	const argv = process.argv.slice(2);
	const getFlag = (name) => {
		const idx = argv.indexOf(name);
		if (idx === -1) return null;
		return argv[idx + 1];
	};

	const inPath = getFlag('--in');
	const outPath = getFlag('--out') || 'dist/client/islands-manifest.json';

	if (!inPath) {
		throw new Error(
			'Usage: react-islands-gen-manifest --in dist/client/.vite/manifest.json [--out dist/client/islands-manifest.json]',
		);
	}

	const absIn = path.resolve(inPath);
	const absOut = path.resolve(outPath);
	buildIslandsManifest({ viteManifestPath: absIn, outPath: absOut });

	console.log(`Wrote ${absOut}`);
};

if (import.meta.url === `file://${process.argv[1]}`) {
	runManifestCli();
}
