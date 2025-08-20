<template>
  <div
    class="cell flex flex-row justify-between gap-12 p-12 text-dark-500"
    :class="{ active: !!active }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="label">
      <div class="cell-label flex flex-row gap-8 items-center text-gray-600" :class="labelClass">
        <slot name="icon">
          <i v-if="icon" class="text-16" :class="icon"></i>
        </slot>
        <div class="flex flex-col gap-4">
          <span class="text-ellipsis">{{ label }}</span>
          <span v-if="help" class="text-ellipsis text-12 text-gray">{{ help }}</span>
        </div>
      </div>
    </slot>
    <slot>
      <div class="cell-value flex flex-row gap-4 items-center max-w-[45%]" :class="valueClass">
        <slot name="value">
          <i v-if="valueIcon" :class="valueIcon"></i>
          <span class="text-ellipsis">{{ valueDisplay }}</span>
        </slot>
        <i v-if="arrow" class="text-gray-400 i-ic:round-arrow-forward-ios flex flex-shrink-0"></i>
      </div>
    </slot>

    <!-- <div>ddd</div> -->
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // import locale
dayjs.locale('zh-cn');
const emit = defineEmits(['click']);
const props = defineProps({
  label: {
    type: [Number, String, null],
  },
  help: {
    type: [Number, String, null],
  },
  labelClass: {
    type: String,
  },
  value: {
    type: [Number, Date, String, null],
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
const handleClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>

<style lang="scss" scoped>
:where(.cell) {
  position: relative;
  min-height: 48rpx;
  background-color: #fff;
}
:where(.cell[disabled='true']) {
  color: #ccc;
  .text-gray,
  .cell-label,
  .cell-value {
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
