<template>
  <div v-if="visible" :class="{ badge: !dot, dot: dot }">
    <span v-if="visible && !dot">
      <slot>
        {{ formatCount || '' }}
      </slot>
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  count: {
    type: [Number, String, null, undefined],
    default: 0,
  },
  max: {
    type: Number,
    default: 99,
  },
  type: {
    type: String,
    default: 'primary', // primary | danger | warning | success
    validator: val => ['primary', 'danger', 'warning', 'success'].includes(val),
  },
  size: {
    type: String,
    default: 'default', // default | small
    validator: val => ['default', 'small'].includes(val),
  },
  dot: {
    type: Boolean,
    default: false,
  },
  absolute: {
    type: Boolean,
    default: true,
  },
});

const formatCount = computed(() => {
  if (props.count > props.max) {
    return `${props.max}+`;
  }
  return props.count;
});

const visible = computed(() => {
  return props.count > 0 || props.dot;
});
</script>

<style lang="scss" scoped>
.dot {
  --dot-size: 20rpx;
  padding: 0;
  border-radius: 50%;
  width: var(--dot-size);
  height: var(--dot-size);
  background-color: #ff4500;
  box-shadow: inset 0 0 0 1px #fbf6f5ce;
}
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  padding: 2rpx 10rpx;
  border: 1px solid white;
  border-radius: 36rpx;
  min-width: 36rpx;
  min-height: 36rpx;
  background-color: #ff4500;
  // line-height: 36rpx;
  font-size: 24rpx;
  color: white;
}
.badge.absolute {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  transform: translate(50%, -50%);
}
.badge.gray {
  background-color: #f6f6f6;
  color: rgb(79, 79, 79);
}
</style>
