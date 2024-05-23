import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    rollupOptions: {
      input: 'src/preload.ts',
      output: {
        format: 'cjs',
        entryFileNames: '[name].js',
        manualChunks: (id, meta) => {
          meta
          if (id.endsWith('.json')) {
            return 'vendor'
          }
        }
      }
    }
  }
})
