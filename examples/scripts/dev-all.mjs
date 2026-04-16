import { spawn } from 'node:child_process';

const targets = [
	{ port: 3000, serverScript: 'dev:commercetools-demo' },
	{ port: 3001, serverScript: 'dev:contentstack-demo' },
	{ port: 3002, serverScript: 'dev:agility-demo' },
	{ port: 3003, serverScript: 'dev:contentstack-commercetools-demo' },
	{ port: 3004, serverScript: 'dev:test-data-demo' },
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
		run('npm', ['run', 'dev:client']),
		...targets.map((target) => run('npm', ['run', target.serverScript], { PORT: String(target.port) })),
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
