import { resolve } from 'node:path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const shared = resolve(__dirname, 'src/shared')

export default defineConfig({
  main: {
    resolve: { alias: { '@shared': shared } },
    build: {
      // electron-store is ESM-only; bundle it into the CommonJS main build.
      externalizeDeps: { exclude: ['electron-store'] },
    },
  },
  preload: {
    resolve: { alias: { '@shared': shared } },
    build: {
      // Sandboxed preloads can't require node_modules, so everything is bundled.
      externalizeDeps: false,
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@shared': shared,
        '@renderer': resolve(__dirname, 'src/renderer'),
      },
    },
    plugins: [react(), tailwindcss()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/renderer/main/index.html'),
        },
      },
    },
  },
})
