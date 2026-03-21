import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

export default defineConfig({
  server: {
	  strictPort: false
  },
  plugins: [
    RubyPlugin(),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
    include: ['**/*.{test,spec}.{js,ts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', 'vendor'],
    root: resolve(__dirname, './app/javascript'),
  },
})

