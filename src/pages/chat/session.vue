<template>
  <div class="session-page" :style="pageStyle">
    <!-- <view class="flex flex-col line-after z-999">
      <AppNavBar title="123" :isBack="true" :border="false" backgroundColor="#f5f5f5">

      </AppNavBar>
    </view> -->
    <div class="nav-bar">顶部导航</div>

    <MessageViewer class="flex-1"></MessageViewer>
    <div>{{ pageStyle }}/{{ windowHeight }}</div>
    <ChatInput />
  </div>
</template>

<script lang="ts" setup>
import MessageViewer from './components/MessageViewer.vue';
import ChatInput from './components/ChatInput.vue';

const windowHeight = uni.getSystemInfoSync().windowHeight;
const pageStyle = reactive({
  // height: `${windowHeight}px`,
});
console.log(windowHeight);

onMounted(() => {
  console.log('mounted');
  window.visualViewport?.addEventListener('resize', () => {
    // pageStyle.height = `${window?.visualViewport?.height}px`;
  });
});
</script>
<style>
html {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.session-page {
  display: flex;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  // width: 100%;
  // height: calc(506px - var(--window-top));
  // height: 100vh;
}
.nav-bar {
  flex-shrink: 0;
  padding-top: 44px;
  height: 44px;
  background: #eee;
}
</style>
