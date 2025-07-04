import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
      afterBuild: () => {
        setTimeout(() => process.exit(0), 300);
      },
    }),
  ],
  build: {
    target: 'node22',
    outDir: 'dist',
    lib: {
      name: '@tray-tecnologia/sdk',
      formats: ['es'],
      entry: resolve(__dirname, 'src/index.ts'),
    },
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.ts'),
        'bin/cli': resolve(__dirname, 'src/bin.ts'),
      },
      output: {
        format: 'es',
        entryFileNames: '[name].js',
      },
      external: [
        'path',
        'os', 
        'fs',
        'fs/promises',
        'module',
        'url',
        'events',
        'child_process',
        'process',
        'buffer',
        'util',
        'stream',
        'string_decoder',
        'tty',
        'crypto',
        'readline',
        'async_hooks',
        'node:path',
        'node:os',
        'node:fs',
        'node:fs/promises',
        'node:module',
        'node:url',
        'node:events',
        'node:child_process',
        'node:process',
        'node:buffer',
        'node:util',
        'node:stream',
        'node:string_decoder',
        'node:tty',
        'node:crypto',
        'node:readline',
        'node:async_hooks',
      ],
    },
  },
});
