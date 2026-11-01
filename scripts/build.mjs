import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { delimiter, dirname, resolve } from 'node:path';
import { ensureCacheDir } from './ensure-cache.mjs';

ensureCacheDir();

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');
const nodeModulesPath = resolve(dirname(nextBin), '../../..');

const child = spawn(
  process.execPath,
  [nextBin, 'build', ...process.argv.slice(2)],
  {
    env: {
      ...process.env,
      NODE_PATH: [nodeModulesPath, process.env.NODE_PATH].filter(Boolean).join(delimiter),
    },
    stdio: 'inherit',
  },
);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('error', (error) => {
  console.error('Unable to run Next.js build:', error);
  process.exitCode = 1;
});

child.on('exit', (code, signal) => {
  process.exitCode = signal === 'SIGINT' ? 130 : signal === 'SIGTERM' ? 143 : code ?? 1;
});
