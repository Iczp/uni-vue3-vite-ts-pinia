<template>
  <div class="app-status-bar flex-row" :style="style">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { showToast } from "vant";

const props = defineProps({
  backgroundColor: {
    required: false,
  },
});
const style = ref({
  backgroundColor: props.backgroundColor, //|| 'white',
});
</script>

<style lang="scss">
.app-status-bar {
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  z-index: 990;
  height: var(--app-status-bar-height);
  background-color: var(--app-status-bar-background-color);
}
</style>
