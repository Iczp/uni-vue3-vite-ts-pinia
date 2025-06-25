<script lang="ts" setup>
import { ref, useSlots } from "vue";
import { showToast } from "vant";
import AppNavBar from "./AppNavBar.vue";
import AppFooter from "./AppFooter.vue";

defineProps({
  title: {},
  statusBarBackgroundColor: [String],
  titleBackgroundColor: [String],
  headerBackgroundColor: [String],
  titleColor: [String],
  isStatusBar: {
    default: true,
  },
});

const slots = useSlots();
</script>

<template>
  <div class="app-page flex-col">
    <slot name="header">
      <div
        class="app-page-header"
        :style="{ backgroundColor: headerBackgroundColor }"
      >
        <slot name="nav-bar">
          <AppNavBar
            :is-status-bar="true"
            :status-bar-background-color="statusBarBackgroundColor"
            :title-background-color="titleBackgroundColor"
            :title-color="titleColor"
          >
            {{ title }}
          </AppNavBar>
        </slot>
      </div>
    </slot>

    <AppFooter v-if="slots.footer">
      <slot name="footer">footer</slot>
    </AppFooter>

    <div class="app-content flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.app-page {
  min-height: 100%;
}
.app-page-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: var(--app-heder-background-color, #fff0);
  // width: 100%;
}
.app-content {
  overflow: auto;
  flex: 1;
  height: 100%;
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
