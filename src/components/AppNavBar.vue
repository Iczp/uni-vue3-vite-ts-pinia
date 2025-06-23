<script setup>
import { ref } from 'vue';
import AppStatusBar from './AppStatusBar.vue';
import { navigateBack } from '@/commons/bridge';

const props = defineProps({
  isStatusBar: {
    default: true,
  },
  statusBarBackgroundColor: {
    required: false,
  },

  titleBackgroundColor: {
    required: false,
  },
  titleColor: {
    required: false,
  },
  border: {
    default: true,
  },
  background: {},
});
const onBack = () => {
  navigateBack();
};

const style = ref({
  backgroundColor: props.titleBackgroundColor,
  color: props.titleColor,
});
</script>

<template>
  <div class="app-nav-bar-wrapper">
    <AppStatusBar v-if="isStatusBar" :background-color="statusBarBackgroundColor"></AppStatusBar>
    <div
      class="app-nav-bar flex flex-row items-center gap-4 px-8"
      :class="{ border }"
      :style="style"
    >
      <slot name="left">
        <div class="back-icon fs-18" @click="onBack">
          <!-- <Icon :color="titleColor" name="ic:sharp-arrow-back-ios-new" /> -->
          <i class="i-ic:baseline-arrow-back-ios"></i>
        </div>
      </slot>
      <div class="flex flex-1 text-ellipsis flex-center" :style="{ color: titleColor }">
        <slot></slot>
      </div>
      <slot name="right">
        <div class="fs-18">
          <!-- <Icon :color="titleColor" name="material-symbols:more-vert" /> -->
          <i class="ic:baseline-more-vert"></i>
        </div>
      </slot>
    </div>
  </div>
</template>

<style lang="scss">
.app-nav-bar-wrapper {
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  z-index: 990;
  background-color: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
}
.app-nav-bar {
  height: var(--app-nav-bar-height);
  font-size: var(--app-nav-font-size);
}
.background {
  background-color: var(--app-nav-background-color);
}
.backdrop {
  backdrop-filter: blur(5px);
}
.app-nav-bar.border::after {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  border-bottom: 1rpx solid rgba(138, 138, 138, 0.6);
  content: '';
  transform: scaleY(0.3);
}
.back-icon {
  min-width: 48rpx;
}
</style>
