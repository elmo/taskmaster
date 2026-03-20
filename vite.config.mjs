
import { defineConfig } from 'vite'
export default defineConfig({
  // ... plugins
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./app/javascript/test/setup.js'],
    // The ** is the key here—it matches any number of subdirectories
    include: ['app/javascript/**/__tests__/**/*.{test,spec}.{js,jsx}', 'app/javascript/**/*.{test,spec}.{js,jsx}'],
  },
})
