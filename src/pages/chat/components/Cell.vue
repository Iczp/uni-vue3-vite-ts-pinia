<template>
  <div
    class="cell flex flex-row justify-between items-center gap-12 px-12 box-border text-dark-500"
    :class="{ active: !!active }"
    :disabled="disabled"
  >
    <slot name="label">
      <div
        class="cell-label flex flex-row gap-8 items-center max-w-[50%] text-gray-600"
        :class="labelClass"
      >
        <slot name="icon">
          <i v-if="icon" class="text-16" :class="icon"></i>
        </slot>
        <span class="text-ellipsis">{{ label }}</span>
      </div>
    </slot>
    <slot>
      <div class="cell-value flex flex-row gap-4 items-center max-w-[45%]" :class="valueClass">
        <slot name="value">
          <i v-if="valueIcon" :class="valueIcon"></i>
          <span class="text-ellipsis">{{ valueDisplay }}</span>
        </slot>
        <i v-if="arrow" class="text-gray-400 i-ic:round-arrow-forward-ios"></i>
      </div>
    </slot>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // import locale
dayjs.locale('zh-cn');
const props = defineProps({
  label: {
    type: [Number, String, null],
  },
  labelClass: {
    type: String,
  },
  value: {
    type: [Number, String, null],
    default: '',
  },
  icon: {
    type: String,
  },
  valueIcon: {
    type: String,
  },
  valueClass: {
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

  format: {
    type: String,
  },
  empty: {
    type: String,
    default: '',
  },
});

const valueDisplay = computed(() => {
  if (props.format && props.value !== undefined && props.value !== null) {
    return dayjs(props.value).format(props.format);
  }
  return props.value || props.empty;
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
