import 'uno.css';
import { createSSRApp, h } from 'vue';
import App from './App.vue';
import store from '@/store';

// https://github.com/Akryum/vue-virtual-scroller/blob/master/packages/vue-virtual-scroller/README.md
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

// 引入 uView UI
import uView from './uni_modules/vk-uview-ui';

// 1. 导入你的指令
import ripple from './directives/ripple';
import doubleTap from './directives/doubleTap';

import { routeInterceptor } from './interceptors/routeInterceptor';
import { requestInterceptor } from './interceptors/requestInterceptor';
routeInterceptor.install();
requestInterceptor.install();

// import { i18n } from './i18n';

export function createApp() {
  const app = createSSRApp(App).use(store);
  // 使用 uView UI
  app.use(uView);
  // vue-virtual-scroller
  app.use(VueVirtualScroller);
  // i18n
  // app.use(i18n)

  // 注册指令，并命名为 'ripple'
  app.directive('ripple', ripple);
  app.directive('double-tap', doubleTap);

  app.config.globalProperties.$createElement = h;
  return {
    app,
  };
}
