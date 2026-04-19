import { spawn } from 'node:child_process';
import path from 'node:path';

const examplesRoot = path.dirname(new URL(import.meta.url).pathname).replace(/\/scripts$/, '');
const runtimeEntryPath = path.resolve(examplesRoot, '../packages/react-islands-ui/src/client/islands-runtime.entry.js');

const targets = [
	{ port: 3000, serverScript: 'dev:commercetools-server' },
	{ port: 3001, serverScript: 'dev:contentstack-server' },
	{ port: 3002, serverScript: 'dev:agility-server' },
	{ port: 3003, serverScript: 'dev:contentstack-commercetools-server' },
	{ port: 3004, serverScript: 'dev:test-data-server' },
];

const runShell = (command) =>
	new Promise((resolve, reject) => {
		const child = spawn('sh', ['-c', command], { stdio: 'inherit' });
		child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Command failed: ${command}`))));
	});

const run = (command, args, envOverrides = {}) =>
	spawn(command, args, {
		stdio: 'inherit',
		shell: true,
		env: { ...process.env, ...envOverrides },
	});

const killPorts = async () => {
	const ports = [5173, ...targets.map((target) => target.port)].join(',');
	await runShell(`kill -9 $(lsof -ti:${ports}) 2>/dev/null || true`);
};

const main = async () => {
	await killPorts();
	await runShell('npm run build:client');

	const children = [
<<<<<<< Updated upstream
		run('npm', ['run', 'dev:client']),
		...targets.map((target) => run('npm', ['run', target.serverScript], { PORT: String(target.port) })),
=======
		run('yarn', ['dev:client']),
		...targets.map((target) =>
			run('yarn', [target.serverScript], { PORT: String(target.port), RUNTIME_ENTRY_PATH: runtimeEntryPath }),
		),
>>>>>>> Stashed changes
	];

	const shutdown = () => {
		for (const child of children) {
			if (child && !child.killed) child.kill('SIGTERM');
		}
	};

	process.on('SIGINT', () => {
		shutdown();
		process.exit(0);
	});

	process.on('SIGTERM', () => {
		shutdown();
		process.exit(0);
	});

	for (const child of children) {
		child.on('exit', () => {
			shutdown();
			process.exit(0);
		});
	}
};

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});
