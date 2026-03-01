import { spawn } from 'node:child_process';

const DEMO_TARGET = process.env.DEMO_TARGET || 'main';

const targets = {
  main: { port: 3000, serverScript: 'dev:server' },
  contentstack: { port: 3001, serverScript: 'dev:contentstack-demo' },
  commercetools: { port: 3000, serverScript: 'dev:commercetools-demo' },
  agility: { port: 3002, serverScript: 'dev:agility-demo' },
  'contentstack-commercetools': { port: 3003, serverScript: 'dev:contentstack-commercetools-demo' }
};

const target = targets[DEMO_TARGET];
if (!target) {
  console.error(`Unknown DEMO_TARGET: ${DEMO_TARGET}`);
  process.exit(1);
}

const runShell = (command) =>
  new Promise((resolve, reject) => {
    const child = spawn('sh', ['-c', command], { stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Command failed: ${command}`))));
  });

const run = (command, args, envOverrides = {}) =>
  spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...envOverrides }
  });

const killPorts = async () => {
  const ports = [target.port, 5173].join(',');
  await runShell(`kill -9 $(lsof -ti:${ports}) 2>/dev/null || true`);
};

const main = async () => {
  await killPorts();
  await runShell('yarn build:client');

  const client = run('yarn', ['dev:client']);
  const server = run('yarn', [target.serverScript], { PORT: String(target.port) });

  const shutdown = () => {
    if (client) client.kill('SIGTERM');
    if (server) server.kill('SIGTERM');
  };

  process.on('SIGINT', () => {
    shutdown();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    shutdown();
    process.exit(0);
  });

  const handleExit = () => {
    shutdown();
    process.exit(0);
  };

  client.on('exit', handleExit);
  server.on('exit', handleExit);
};

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
