import fs from 'node:fs';
import { resolve } from 'node:path';

export function ensureCacheDir(cwd = process.cwd(), fallbackTarget = '/tmp/jeto-website-next') {
  try {
    const nextDir = resolve(cwd, '.next');
    let targetDir = fallbackTarget;

    try {
      const stat = fs.lstatSync(nextDir);
      if (stat.isSymbolicLink()) {
        const rawTarget = fs.readlinkSync(nextDir);
        targetDir = resolve(cwd, rawTarget);
      }
    } catch {
      // .next does not exist yet; create target directory and symlink
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      try {
        fs.symlinkSync(targetDir, nextDir, 'junction');
      } catch {
        // Fallback if symlink creation is restricted
      }
    }

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
  } catch (err) {
    console.warn('Warning: Could not verify cache directory:', err.message);
  }
}

if (process.argv[1] && process.argv[1].endsWith('ensure-cache.mjs')) {
  ensureCacheDir();
}
