import { spawn } from 'node:child_process';
import process from 'node:process';

const targets = [
  { name: 'backend', cwd: 'backend' },
  { name: 'frontend', cwd: 'frontend' }
];

const children = targets.map(({ name, cwd }) => {
  const child = spawn('npm', ['run', 'dev'], {
    cwd,
    stdio: 'inherit',
    shell: true
  });

  child.on('exit', (code) => {
    console.log(`[${name}] exited with code ${code}`);
    shutdown();
  });

  return child;
});

let shuttingDown = false;

function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
