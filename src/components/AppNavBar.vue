<template>
  <div class="app-nav-bar-wrapper">
    <AppStatusBar
      v-if="isStatusBar"
      :background-color="statusBarBackgroundColor"
    ></AppStatusBar>
    <div
      class="app-nav-bar flex flex-row items-center gap-4 px-12 text-18"
      :class="{ border }"
      :style="style"
    >
      <slot v-if="isBack" name="left">
        <div class="back-icon" @click="onBack">
          <!-- <Icon icon="ic:round-arrow-back-ios" /> -->

          <!-- <i class="i-material-symbols:arrow-back-ios-new" /> -->
          <div class="i-ic:round-arrow-back-ios"></div>
          <!-- <div class="i-ic:twotone-more-vert"></div> -->
          <!-- <div class="i-ic:round-more-vert"></div>-->
          <!-- <div class="i-mdi:arrow-back"></div> -->
        </div>
      </slot>
      <div
        class="flex flex-1 text-ellipsis flex-center"
        :style="{ color: titleColor }"
      >
        <slot>{{ title }}</slot>
      </div>
      <slot name="right">
        <div class="flex gap-12">
          <!-- <div class="i-ic:baseline-settings"></div>
          <div class="i-ic:outline-ios-share"></div>
          <div class="i-ic:sharp-share"></div> -->
          <!-- <div class="i-ic:baseline-more-vert"></div> -->
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import AppStatusBar from "./AppStatusBar.vue";
import { navigateBack } from "@/commons/bridge";
// import { Icon } from '@iconify/vue';
const props = defineProps({
  isStatusBar: {
    default: true,
  },
  isBack: {
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
  title: {
    type: String,
    default: "",
  },
  border: {
    default: false,
  },
  background: {},
});
const onBack = () => {
  const pages = getCurrentPages();
  const page = pages[pages.length - 1];
  console.log("onBack", page.$page, pages);
  if (pages.length <= 1) {
    // 如果只有一个页面，则返回使用 bridge
    navigateBack();
    return;
  }
  uni.navigateBack();
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
  // background-color: rgba(255, 255, 255, 0.6);
  // backdrop-filter: blur(10px);
}
.app-nav-bar {
  justify-content: space-around;
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
