import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
      afterBuild: () => {
        setTimeout(() => process.exit(0), 300);
      },
    }),
  ],
  build: {
    target: 'node22',
    outDir: 'dist',
    lib: {
      name: '@tray-tecnologia/theme-sdk',
      formats: ['es'],
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
      },
    },
    rollupOptions: {
      external: ['node:fs', 'node:fs/promises', 'node:os', 'node:path'],
    },
  },
});
