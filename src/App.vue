<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
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
</script>

<style lang="scss">
// @import '@/commons/css/index.scss';
:root,
page {
  /* --app-color: red; */
  /* 其他全局变量 */
  /* --app-status-bar-height: '0px'; */
  --app-nav-font-size: 34rpx;
  --app-nav-bar-height: 44px;
  --app-footer-height: 120rpx;
  --app-status-bar-background-color: 'rgba(217, 217, 217, 1)';
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
