<template>
  <div class="check-box text-gray" :checked="modelValue" :disabled="disabled" :class="icon" @click="change">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [Boolean, null],
    default: false,
    required: false,
  },
  disabled: {
    type: [Boolean],
    required: false,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const change = () => {
  if (props.disabled) return;
  emit('change', !props.modelValue);
  emit('update:modelValue', !props.modelValue);
};

const icon = computed(() => {
  if (props.modelValue === true) {
    return 'i-ic:round-check-box';
  }
  if (props.modelValue === false) {
    return 'i-ic:round-check-box-outline-blank';
  } else {
    return 'i-ic:round-indeterminate-check-box';
  }
});
</script>

<style lang="scss">
:where(.check-box) {
  font-size: 44rpx;
  color: rgb(81, 81, 81);
}
.check-box[checked='true'] {
  color: rgb(23, 110, 210);
}
.check-box[disabled='true'] {
  color: gray !important;
}
</style>
