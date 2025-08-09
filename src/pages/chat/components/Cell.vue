<template>
  <div
    class="cell flex flex-row justify-between items-center gap-12 px-12 box-border text-dark-500"
    :class="{ active: !!active }"
    :disabled="disabled"
  >
    <slot name="label">
      <div class="cell-label flex flex-row gap-8 items-center max-w-[50%] text-gray-600">
        <slot name="icon">
          <i v-if="icon" class="text-16" :class="icon"></i>
        </slot>
        <span class="text-ellipsis">{{ label }}</span>
      </div>
    </slot>
    <slot>
      <div class="cell-value flex flex-row gap-4 items-center max-w-[45%]">
        <slot name="value">
          <i v-if="valueIcon" :class="valueIcon"></i>
          <span class="text-ellipsis">{{ value }}</span>
        </slot>
        <i v-if="arrow" class="text-gray-400 i-ic:round-arrow-forward-ios"></i>
      </div>
    </slot>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: [Number, String, null, undefined],
  },
  value: {
    type: [Number, String, null, undefined],
    default: '',
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
  url: {
    type: [String, Boolean],
    default: false,
  },
  disabled: {
    type: [Boolean],
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
.cell {
  position: relative;
  min-height: 96rpx;
  background-color: #fff;
}
.cell[disabled='true'] {
  color: #ccc;
  .cell-label {
    color: #ccc;
  }
}
.active:not([disabled='true']):active {
  background-color: rgba(0, 0, 0, 0.05);
}
.cell:not(.before-none):first-child::before,
.cell::after {
  position: absolute;
  left: 24rpx;
  right: 0;
  height: 1px;
  background-color: var(--border-color, #d5d5d5);
  content: '';
  transform: scaleY(0.33);
}
.cell:not(.before-none):first-child::before {
  top: 0;
}
.cell::after {
  bottom: 0;
}
.cell:not(.before-none):first-child::before,
.cell:last-child::after {
  left: 0;
}
</style>
