import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/biz-data': path.resolve(__dirname, '../biz-data'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // 使用新的 Sass API，消除 deprecation 警告
      },
    },
  },
  server: {
    port: 9080,
    open: true,
    fs: {
      // 允许访问项目根目录的 biz-data 文件夹
      strict: false,
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname, '../biz-data'),
      ],
    },
  },
  // 配置公共基础路径，使 /biz-data 可访问
  publicDir: 'public',
  optimizeDeps: {
    exclude: ['@/biz-data'],
  },
})

