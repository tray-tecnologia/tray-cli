import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import setBinaryPermission from './setBinaryPermission';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.build.json',
      outDirs: './dist/types',
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
      external: (id: string) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('#'),
    },
  },
});
