<template>
  <div>
    <u-tabbar v-model="current" :list="list" :mid-button="true"></u-tabbar>
  </div>
</template>

<script lang="ts" setup>
const current = ref(0);
const list = ref([
  {
    icon: '<div class="i-ic:baseline-message"></div>',
    text: '首页',
    pagePath: '/pages/index/index',
  },
  {
    icon: 'chat',
    text: '聊天',
    pagePath: '/pages/im/chat',
  },
  {
    icon: 'selector',
    text: '选择器',
    pagePath: '/pages/selector/selector',
  },
]);
</script>

<style lang="scss" scoped></style>
