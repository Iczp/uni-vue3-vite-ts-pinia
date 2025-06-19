<template>
  <div class="app-nav-bar-wrapper">
    <AppStatusBar
      v-if="isStatusBar"
      :backgroundColor="statusBarBackgroundColor"
    ></AppStatusBar>
    <div
      class="app-nav-bar flex-row items-center gap-4 px-12"
      :class="{ border: border }"
      :style="style"
    >
      <slot name="left">
        <div class="back-icon" @click="onBack">
          <uni-icons
            type="back"
            :color="titleColor || 'rgba(87, 87, 87, 1.0)'"
            :size="24"
          ></uni-icons>
        </div>
      </slot>
      <div
        class="flex-1 text-ellipsis flex-center"
        :style="{ color: titleColor }"
      >
        <slot></slot>
      </div>
      <slot name="right">
        <uni-icons
          type="more-filled"
          :color="titleColor || 'rgba(87, 87, 87, 1.0)'"
          :size="20"
          style="transform: rotate(90deg);"
        ></uni-icons>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";
import { navigateBack } from "../commons/bridge";
import AppStatusBar from "./AppStatusBar.vue";

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
