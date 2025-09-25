import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import setBinaryPermission from './setBinaryPermission';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDir: './dist/types',
      beforeWriteFile: (filePath: string, content: string) => {
        return {
          filePath: filePath.replace('dist/types/src', 'dist/types'),
          content,
        };
      },
    }),
    setBinaryPermission(),
  ],
  build: {
    target: 'node22',
    outDir: 'dist',
    lib: {
      name: '@tray-tecnologia/cli',
      formats: ['es'],
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        'bin/cli': resolve(__dirname, 'src/bin.ts'),
      },
    },
    rollupOptions: {
      external: [
        'node:async_hooks',
        'node:buffer',
        'node:child_process',
        'node:events',
        'node:fs',
        'node:fs/promises',
        'node:module',
        'node:os',
        'node:path',
        'node:process',
        'node:readline',
        'node:stream',
        'node:string_decoder',
        'node:tty',
        'node:url',
        'node:util',
        'node:crypto',
        'buffer',
        'child_process',
        'crypto',
        'events',
        'fs',
        'fs/promises',
        'os',
        'path',
        'stream',
        'string_decoder',
        'tty',
        'util',
      ],
    },
  },
});
