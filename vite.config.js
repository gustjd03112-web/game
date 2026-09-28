import { defineConfig } from 'vite'

export default defineConfig({
  // 개발할 때
  //base: '/'
  
  // GitHub Pages에 올릴 때
  base: '/game/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})