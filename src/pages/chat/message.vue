<template>
  <div class="page">
    <AppNavBar title="消息" :isBack="false" :border="true" backgroundColor="#f5f5f5" />

    <div class="message-content">
      <p>这里是消息内容</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TabBar from './components/tab-bar.vue';

onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
});
</script>

<style lang="scss" scoped></style>
