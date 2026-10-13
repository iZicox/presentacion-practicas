import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, /api/* se redirige al Worker de Express (wrangler dev).
    proxy: {
      '/api': 'http://127.0.0.1:8787',
    },
  },
})
