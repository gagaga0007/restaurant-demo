import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

const SERVER = process.env.SERVER || 'http://127.0.0.1:8080/'
const MODULES_PREFIX = 'modules'
const APP_PREFIX = 'app'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      jsxImportSource: '@emotion/react',
    }),
    visualizer({
      open: true,
    }),
  ],
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
  build: {
    chunkSizeWarningLimit: 512,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            if (id.includes('dayjs')) {
              return `${MODULES_PREFIX}/dayjs`
            } else if (id.includes('babel')) {
              return `${MODULES_PREFIX}/babel`
            } else if (id.includes('fabric')) {
              return `${MODULES_PREFIX}/fabric`
            } else if (id.includes('axios')) {
              return `${MODULES_PREFIX}/axios`
            } else if (id.includes('lodash')) {
              return `${MODULES_PREFIX}/lodash`
            } else if (id.includes('emotion')) {
              return `${MODULES_PREFIX}/emotion`
            } else {
              return `${MODULES_PREFIX}/vendor`
            }
          } else if (id.includes('src')) {
            return `${APP_PREFIX}/app`
          }
        },
      },
    },
  },
})
