import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/game/' : '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}));