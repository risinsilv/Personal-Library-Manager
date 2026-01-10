import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Read .env file from parent directory (root)
  envDir: path.resolve(__dirname, '..'),
})
