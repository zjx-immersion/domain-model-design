import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
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
      '@': resolve(__dirname, 'src'),
      '@/data': resolve(__dirname, 'src/data'),
      '@/biz-data': resolve(__dirname, '../biz-data'),
    },
  },
  server: {
    port: 9080,
    open: true,
    fs: {
      // 允许访问项目根目录的 biz-data 文件夹
      allow: ['..'],
    },
  },
  // 配置公共基础路径，使 /biz-data 可访问
  publicDir: 'public',
})

