import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        scamshield: resolve(__dirname, 'ScamShield/public/index.html'),
        airblocks: resolve(__dirname, 'Air-Blocks/index.html'),
        dashey: resolve(__dirname, 'dashey/index.html'),
        aether: resolve(__dirname, 'Aether/index.html'),
        paper3: resolve(__dirname, 'research/paper3/index.html'),
      },
    },
  },
})
