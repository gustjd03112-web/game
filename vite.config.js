import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  // mode에 따라 자동으로 base 경로 변경
  base: mode === 'production' ? '/game/' : '/',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
}))