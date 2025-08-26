<script setup lang="ts">
import { onHide, onLaunch, onShow, onError } from '@dcloudio/uni-app';
import { useBridge } from './hooks/bridge';
import { isHtml5Plus } from './utils/platform';
import { appReady } from './commons/bridge/ready';
import { getAuth } from './commons/bridge';
const events = 'connecting,connected,reconnected,reconnecting,close,received'
  .split(',')
  .map(x => `${x}@signalr`);

onLaunch(() => {
  console.log('App Launch');

  if (isHtml5Plus) {
    events.forEach(event => {
      console.log(`uni.$on: ${event}`);
      uni.$on(event, (...args) => {
        console.log(`#--H5--# Event: ${event}`, ...args);
      });
    });
    // 初始化桥接
    useBridge();
  }

  appReady(() => {
    console.log('appReady url:', document.URL);

    // uni.showToast({ icon: 'none', title: 'appReady6' });
    // const pages = getCurrentPages();
    // uni.showToast({ icon: 'none', title: `${pages.length}${document.URL}` });
    // return;
    // uni.navigateTo({
    //   url: '/pages/index/index'
    // });
    getAuth()
      .then(res => {
        var erpHeader = res.result?.header;
        const token = res.result?.token;
        // uni.showToast({ icon: 'none', title: `${res.result}` });
        const erpUser = res.result?.user;
        if (erpUser) {
          uni.showToast({ icon: 'none', title: `${erpUser?.name}${erpUser?.userId}` });
        }
        console.log('getAuth' + JSON.stringify(res));
      })
      .catch(err => {
        console.error('getAuth error', err);
        uni.showToast({ icon: 'none', title: `err:${err}` });
      });
  });
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
