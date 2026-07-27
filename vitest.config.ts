import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // You might need jsdom for React components later, or leave as default (node) for pure functions
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
