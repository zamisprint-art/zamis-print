import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://zamis-print.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://zamis-print.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
