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
        'commander',
        'chalk',
        'inquirer',
        'ora',
        'open',
        'glob',
        'chokidar',
        'isbinaryfile',
        'slash',
      ],
    },
  },
});
