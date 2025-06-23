<script setup>
import { ref } from 'vue';

const props = defineProps({
  backgroundColor: {
    required: false,
  },
});
const style = ref({
  backgroundColor: props.backgroundColor, // || 'white',
});
</script>

<template>
  <div class="app-status-bar flex-row" :style="style">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.app-status-bar {
  position: sticky;
  left: 0;
  right: 0;
  top: 0;
  z-index: 990;
  height: var(--status-bar-height);
  background-color: var(--status-bar-background-color);
}
</style>
