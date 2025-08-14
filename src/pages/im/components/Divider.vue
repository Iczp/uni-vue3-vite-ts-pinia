<template>
  <div class="flex flex-center p-12 text-12 text-gray">
    <slot>
      <div class="divider-text">{{ text }}</div>
    </slot>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    default: '·',
  },
});
</script>
<style lang="scss" scoped>
.divider-text {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 0 24rpx;
  padding: 0 24rpx;
  color: #999;
}
.divider-text::after,
.divider-text::before {
  display: flex;
  flex: 1;
  margin: 0 24rpx;
  // width: 100%;
  // width: 20%;
  height: 1rpx;
  background-color: #999;
  content: '';
  transform: scaleY(0.3);
}
</style>
