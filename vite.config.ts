import { resolve } from 'node:path';
import uni from '@dcloudio/vite-plugin-uni';
import AutoImportTypes from 'auto-import-types';
import PiniaAutoRefs from 'pinia-auto-refs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const Unocss = require('unocss/vite').default;
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import { VantResolver } from '@vant/auto-import-resolver';
import env from './src/config/env';
import { ComponentResolver } from 'unplugin-vue-components/types';

// 自动引入 @iconify/vue 的 Icon 组件
const IconsResolver =
  (options?: {}): ComponentResolver =>
  (name: any) => {
    if (name === 'Icon') {
      console.log('Auto-importing Icon component from @iconify/vue', name);
      return {
        name: 'Icon',
        from: '@iconify/vue',
      };
    }
  };

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@utils': resolve(__dirname, 'src/commons/utils'),
      '@bridge': resolve(__dirname, 'src/commons/bridge'),
    },
  },
  plugins: [
    AutoImportTypes(),
    PiniaAutoRefs(),
    AutoImport({
      dts: 'src/auto-imports.d.ts',
      imports: [
        'vue',
        'uni-app',
        'pinia',
        {
          '@/helper/pinia-auto-refs': ['useStore'],
        },
      ],
      exclude: ['createApp'],
      eslintrc: {
        enabled: true,
      },
      resolvers: [VantResolver()],
    }),
    Components({
      extensions: ['vue'],
      dts: 'src/components.d.ts',
      resolvers: [
        VantResolver(),

        // 自动引入 @iconify/vue 的 Icon 组件
        // IconsResolver(),
      ],
    }),
    // Icons({
    //   compiler: 'vue3',
    //   autoInstall: true,
    // }),
    uni(),
    Unocss(),
    {
      name: 'injector-bridge',
      transformIndexHtml(html) {
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: { src: '/static/js/uni.webview.1.5.6.js' },
              injectTo: 'head-prepend',
            },
            {
              tag: 'style',
              attrs: { src: '/static/css/index.scss' },
              injectTo: 'head-prepend',
            },
          ],
        };
      },
    },
  ],
  server: {
    port: 4000, // 设置开发服务器端口
    open: true, // 自动打开
    // base: "./ ", // 生产环境路径
    // proxy: {
    //   // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
    //   // 正则表达式写法
    //   '^/api': {
    //     target: env.apiBaseUrl, // 后端服务实际地址
    //     changeOrigin: true, // 开启代理
    //     rewrite: path => path.replace(/^\/api/, ''),
    //   },
    // },
  },
  build: {
    sourcemap: true, // 确保生成Source Map文件
    // // 打包配置
    // outDir: "dist", // 输出目录
    // assetsDir: "assets", // 静态资源目录
    // sourcemap: false, // 是否生成 source map 文件
    // rollupOptions: {
    //   output: {
    //     entryFileNames: "js/[name].js",
    //     chunkFileNames: "js/[name].js",
    //     assetFileNames: "assets/[name].[ext]",
    //   },
    // },
  },
});
