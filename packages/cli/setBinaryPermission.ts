import { execSync } from 'child_process';
import type { Plugin, ResolvedConfig } from 'vite';

export default function setBinaryPermission(): Plugin {
  let config: ResolvedConfig;

  return {
    name: 'set-binary-permission',

    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },

    async closeBundle() {
      if (config.mode === 'production') {
        execSync('chmod +x dist/bin/cli.js');
      }
    },
  };
}
