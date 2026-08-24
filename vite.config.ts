import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
//
// `npm run build` produces a normal multi-file production build for real
// deployment. `npm run build:demo` (DEMO_SINGLEFILE=1) additionally inlines
// everything into one index.html — used only to publish a self-contained,
// clickable live demo (e.g. as a Claude Artifact), not for production
// hosting.
export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'demo' ? [viteSingleFile()] : [])],
  build: {
    chunkSizeWarningLimit: 2000,
  },
}))
