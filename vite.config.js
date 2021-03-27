import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/community.manage-web': {
        target: 'https://tkzhushou.mylianzhi.com',
        changeOrigin: true
      }
    }
  },
  plugins: [
    vue(),
    vitePluginImp({
      libList: [
        {
          libName: 'element-plus',
          style: (name) => {
            return`element-plus/lib/theme-chalk/${name}.css`
          }
        }
      ]
    })
  ]
})
