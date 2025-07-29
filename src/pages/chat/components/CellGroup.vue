<template>
  <div class="cell-group text-gray-500">
    <slot v-if="label" name="label">
      <div class="cell-label flex flex-row gap-8 items-center h-32 items-center px-12 ">
        <i v-if="icon" :class="icon"></i>
        <span>{{ label }}</span>
      </div>
    </slot>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: [String, null, undefined],
  },
  icon: {
    type: String,
  },
  valueIcon: {
    type: String,
  },
  arrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.cell-group {
  display: flex;
  position: relative;
  flex-direction: column;
  margin-top: 24rpx;
}
.cell-group:first-child {
  margin-top: 0;
}
</style>
