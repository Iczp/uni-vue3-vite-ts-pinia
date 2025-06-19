<template>
  <div class="app-page flex-col">
    <slot name="nav-bar">
      <AppNavBar
        :isStatusBar="true"
        :statusBarBackgroundColor="statusBarBackgroundColor"
        :titleBackgroundColor="titleBackgroundColor"
        :titleColor="titleColor"
        >{{ title }}
      </AppNavBar>
    </slot>

    <AppFooter v-if="slots.footer">
      <slot name="footer"> footer </slot>
    </AppFooter>

    <div class="app-content flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, useSlots } from "vue";
import AppStatusBar from "./AppStatusBar.vue";
import AppNavBar from "./AppNavBar.vue";
import AppFooter from "./AppFooter.vue";
import { showToast } from "vant";

defineProps({
  title: {},
  statusBarBackgroundColor: [String],
  titleBackgroundColor: [String],
  titleColor: [String],
  isStatusBar: {
    default: true,
  },
});

const slots = useSlots();
const count = ref(0);
const isLoading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    showToast("刷新成功");
    isLoading.value = false;
    count.value++;
  }, 1000);
};
</script>

<style lang="scss">
.app-page {
  min-height: 100%;
}
.app-footer + .app-content {
  padding-bottom: var(--app-footer-height);
}
.refresh-content {
  margin-top: var(--app-status-bar-height);
  background-color: var(--primary-color);
  color: var(--app-color);
  // color: darkred;
}
</style>
