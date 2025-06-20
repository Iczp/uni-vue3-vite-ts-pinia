<script lang="ts" setup>
import { ref } from 'vue';
import { showToast } from 'vant';
defineProps({
  border: {
    default: true,
  },
});
const count = ref(0);
const isLoading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    isLoading.value = false;
    count.value++;
  }, 1000);
};
</script>

<template>
  <div class="app-footer flex-col space-between" :class="{ border }">
    <slot></slot>
    <div class="app-safe-area-insets-bottom"></div>
  </div>
</template>

<style lang="scss">
.app-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 990;
  box-sizing: border-box;
  height: var(--app-footer-height);
  background-color: var(--app-footer-background-color);
}
.app-footer.border::before {
  position: absolute;
  left: 0%;
  right: 0;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid rgba(138, 138, 138, 0.6);
  content: '';
  transform: scaleY(0.3);
}
.app-safe-area-insets-bottom {
  height: var(--app-safe-area-insets-bottom);
  background-color: #5ff;
}
</style>
