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

<style lang="scss"></style>
