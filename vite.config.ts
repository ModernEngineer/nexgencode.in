import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import seoPlugin from './seo.plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  // Inline config stops Vite from searching parent dirs and picking up an unrelated postcss.config.* (e.g. D:\postcss.config.mjs)
  css: { postcss: {} },
  // Dev: forward API calls and uploaded images to the .NET API (backend/NexGenCode.Api)
  server: {
    proxy: {
      '/api': 'http://localhost:5080',
      '/uploads': 'http://localhost:5080',
    },
  },
  preview: {
    proxy: {
      '/api': 'http://localhost:5080',
      '/uploads': 'http://localhost:5080',
    },
  },
})
