// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // other config options...

  build: {
	target: 'esnext',
    lib: {
      entry: 'source/cli.ts',
      formats: ['cjs'],
    },
    outDir: 'dist',
  },
});
