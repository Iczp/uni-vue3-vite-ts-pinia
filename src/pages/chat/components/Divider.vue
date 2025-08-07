<template>
  <div class="flex flex-center p-12 text-12 w-full text-gray">
    <div class="divider-text">美好生活从这里开始</div>
  </div>
</template>
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
