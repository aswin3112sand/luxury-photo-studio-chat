import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'k-photo-studio',
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
