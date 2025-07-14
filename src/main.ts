import 'uno.css';
import { createSSRApp } from 'vue';
import App from './App.vue';
import store from '@/store';

// https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/README.md
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';


// 引入 uView UI
import uView from './uni_modules/vk-uview-ui';

export function createApp() {
  const app = createSSRApp(App).use(store);
  // 使用 uView UI
  app.use(uView);
  // vue-virtual-scroller
  app.use(VueVirtualScroller);
  return {
    app,
  };
}
