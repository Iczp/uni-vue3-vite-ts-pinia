<template>
  <div class="flex tag tag-creator">
    <slot>群主</slot>
  </div>
</template>

<script lang="ts" setup></script>
<style lang="scss" scoped>
.tag {
  padding: 2rpx 8rpx;
  border: 1rpx solid rgba(78, 148, 181, 0.8);
  border-radius: 6rpx;
  background-color: rgba(182, 226, 255, 0.8);
  font-size: 20rpx;
  color: rgba(4, 87, 231, 0.8);
}
.tag-creator {
  white-space: nowrap;
}
</style>
