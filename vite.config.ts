import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // No GitHub Pages o site fica em /meus-estudos/; localmente, na raiz.
  base: command === 'build' ? '/meus-estudos/' : '/',
}))
