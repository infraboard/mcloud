import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  // 强制预构建插件包
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/basic-languages/yaml/yaml.contribution`,
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/mcenter/api/v1': {
        target: 'http://127.0.0.1:8010'
      },
      '/mflow/api/v1/ws': {
        target: 'http://127.0.0.1:8090',
        ws: true,
      },
      '/mflow/api/v1': {
        target: 'http://127.0.0.1:8090'
      },
      '/mpaas/api/v1/ws': {
        target: 'http://127.0.0.1:8080',
        ws: true,
      },
      '/mpaas/api/v1': {
        target: 'http://127.0.0.1:8080'
      }
    }
  }
})
