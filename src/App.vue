<script setup lang="ts">
import { onHide, onLaunch, onShow, onError } from '@dcloudio/uni-app';
import { useBridge } from './hooks/bridge';
onLaunch(() => {
  console.log('App Launch');

  useBridge();
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
onError(err => {
  console.log('App error', err);
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
  --app-nav-bar-height: 48px;
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
