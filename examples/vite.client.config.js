import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { globSync } from 'glob';

const examplesRoot = process.cwd();
const repoRoot = path.resolve(examplesRoot, '..');
const componentsRoot = path.resolve(examplesRoot, '../packages/react-islands-ui');

const islands = globSync('src/islands/*.entry.@(js|jsx)', { cwd: componentsRoot });

const input = {
	'islands-runtime': path.resolve(componentsRoot, 'src/client/islands-runtime.entry.js'),
};

for (const rel of islands) {
	const base = rel.replace(/^src\/islands\//, 'islands/').replace(/\.entry\.(js|jsx)$/, '');
	input[base] = path.resolve(componentsRoot, rel);
}

export default defineConfig({
	root: componentsRoot,
	plugins: [react()],
	publicDir: path.resolve(examplesRoot, '_shared/public'),
	resolve: {
		alias: {
			react: path.resolve(examplesRoot, 'node_modules/react'),
			'react-dom': path.resolve(examplesRoot, 'node_modules/react-dom'),
		},
	},
	server: {
		fs: {
			allow: [repoRoot],
		},
	},
	build: {
		outDir: path.resolve(examplesRoot, 'dist/client'),
		emptyOutDir: true,
		manifest: true,
		minify: 'esbuild',
		sourcemap: false,
		rollupOptions: {
			preserveEntrySignatures: 'strict',
			input,
			output: {
				entryFileNames: 'assets/[name]-[hash].js',
				chunkFileNames: 'assets/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash][extname]',
			},
		},
	},
});
