<script setup lang="ts">
import { onHide, onLaunch, onShow, onError } from '@dcloudio/uni-app';
import { loginByApp, useBridge } from './commons/bridge/ready';
import { parseUrl } from './utils/shared';
import { useAuthStore } from './store/auth';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

onLaunch(async () => {
  console.log('App Launch');
  var uri = parseUrl(document.URL);
  console.log('document.URL', document.URL, uri);

  // 快捷登录逻辑: 获取用户ID，并设置到store中
  const userId = uri.query?.sub;
  const authStore = useAuthStore();
  authStore.setCurrentUserId(userId || null);
  
  // if (userId) {
  //   uni.showToast({ icon: 'none', title: `userId[${authStore.isLogin}]:${userId}` });
  //   // await wait(5000);
  // }

  // 初始化桥接
  useBridge();

  // 尝试通过App登录
  // loginByApp();

});
onShow(e => {
  console.log('App Show', e);

  const pages = getCurrentPages();
  const page = pages[pages.length - 1];

  console.log('App Show', page);
});
onHide(() => {
  console.log('App Hide');
});
onError(err => {
  console.error('App error', err);
});
</script>

<style lang="scss">
@import '@/static/css/index.scss';
@import './uni_modules/vk-uview-ui/index.scss';
:root,
page {
  /* --app-color: red; */
  /* 其他全局变量 */
  /* --app-status-bar-height: '0px'; */
  --app-nav-font-size: 34rpx;
  --app-nav-bar-height: 56px;
  --app-footer-height: 120rpx;
  --status-bar-background-color: 'rgba(217, 217, 217, 1)';
}
/* 全局样式 */
page {
  background-color: #f8f8f8;
  font-family: -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}
</style>
