import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { globSync } from 'glob';

const examplesRoot = process.cwd();
const runtimeRoot = path.resolve(examplesRoot, '_shared/runtime');
// const runtimeSrc = path.join(runtimeRoot, 'src');

const islands = globSync('src/islands/*.entry.@(js|jsx)', { cwd: runtimeRoot });

const input = {
	'islands-runtime': path.resolve(runtimeRoot, 'src/client/islands-runtime.entry.js'),
};

for (const rel of islands) {
	const base = rel.replace(/^src\/islands\//, 'islands/').replace(/\.entry\.(js|jsx)$/, '');
	input[base] = path.resolve(runtimeRoot, rel);
}

export default defineConfig({
	root: runtimeRoot,
	plugins: [react()],
	publicDir: path.resolve(examplesRoot, '_shared/public'),
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
