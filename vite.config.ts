import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const SERVER = process.env.SERVER || 'http://127.0.0.1:8080/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
      jsxImportSource: '@emotion/react',
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
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            // if (id.includes('react')) {
            //   return 'react'
            // } else if (id.includes('antd')) {
            //   return 'antd'
            // } else if (id.includes('@ant-design')) {
            //   return '@ant-design'
            // } else if (id.includes('dayjs')) {
            //   return 'dayjs'
            // } else if (id.includes('babel')) {
            //   return 'babel'
            // } else if (id.includes('fabric')) {
            //   return 'fabric'
            // } else if (id.includes('axios')) {
            //   return 'axios'
            // } else {
            return 'vendor'
            // }
          } else if (id.includes('src')) {
            return 'app'
          }
        },
      },
    },
  },
})
