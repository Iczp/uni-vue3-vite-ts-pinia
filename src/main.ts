import 'uno.css';
import { createSSRApp } from 'vue';
import App from './App.vue';
import store from '@/store';

// 引入 uView UI
import uView from './uni_modules/vk-uview-ui';

export function createApp() {
  const app = createSSRApp(App).use(store);
  // 使用 uView UI
  app.use(uView);
  return {
    app,
  };
}
