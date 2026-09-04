import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, mergeConfig } from 'vite'
import { defineConfig as defineVitestConfig } from 'vitest/config'

const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})

export default mergeConfig(
  viteConfig,
  defineVitestConfig({
    test: {
      include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    },
  }),
)
