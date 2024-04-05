import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const SERVER = process.env.SERVER || 'http://127.0.0.1:8080/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '^/api/.*': {
        target: SERVER,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    proxy: {
      '^/api/.*': {
        target: SERVER,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
