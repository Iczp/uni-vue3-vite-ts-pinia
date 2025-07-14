<template>
  <div class="nav-btn" :theme="theme">
    <div
      class="btn-item"
      v-for="(item, index) in items"
      :key="index"
      @click="$emit('click', item, index)"
    >
      <i :class="item.icon"></i>
    </div>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
  btns: {
    type: Object as () => Record<string, string>,
    default: () => ({
      // plus: 'i-ic:baseline-plus',
      more: 'i-ic:outline-more-horiz',
      // moreVert: 'i-ic:outline-more-vert',
      // expand: 'i-ic:baseline-expand-more',
      album: 'i-ic:outline-album',
    }),
  },
});

const items = Object.values(props.btns).map((icon, type) => ({
  type,
  icon,
}));
</script>
<style lang="scss" scoped>
.nav-btn {
  --border-color: rgba(106, 106, 106, 0.3);
  display: flex;
  position: fixed;
  right: 24rpx;
  top: calc(var(--status-bar-height) + 28rpx);
  z-index: 999;
  justify-content: center;
  align-items: center;
  font-size: 32rpx;
  color: #333;
}
.nav-btn[theme='dark'] {
  --border-color: rgba(255, 255, 255, 0.3);
  color: #fff;
}
.btn-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16rpx;
  border: 1rpx solid var(--border-color);
  border-right: 0;
  height: 52rpx;
  background-image: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(233, 233, 233, 0.3));
}
.btn-item:first-child:last-child {
  border-radius: 36rpx;
}
.btn-item:first-child {
  padding-left: 24rpx;
  border-radius: 36rpx 0 0 36rpx;
}
.btn-item:last-child {
  padding-right: 24rpx;
  border-right: 1rpx solid var(--border-color);
  border-radius: 0 36rpx 36rpx 0;
}
.btn-item:hover {
  background-image: linear-gradient(0deg, rgba(255, 255, 255, 0.3), rgba(233, 233, 233, 0.3));
}
</style>
