<!-- src/components/MessageListSkeleton.vue -->
<template>
  <div class="message-list-skeleton relative flex flex-col">
    <div
      v-if="text"
      class="absolute left-0 right-0 top-0 bottom-0 z-1 flex text-12 flex-center text-gray-300"
    >
      {{ text }}
    </div>
    <!-- 使用 v-for 循环渲染指定数量的骨架项 -->
    <div v-for="n in count" :key="n" class="skeleton-item flex flex-row gap-12 px-12 py-8">
      <!-- 左侧的头像骨架 -->
      <div class="skeleton-avatar skeleton flex flex-center">
        <i class="text-24 text-gray-200 i-ic:baseline-person"></i>
      </div>

      <!-- 右侧的内容骨架 -->
      <div class="skeleton-content">
        <div class="flex flex-row justify-between">
          <span class="skeleton-line short skeleton"></span>
          <span class="skeleton-line w-64 skeleton"></span>
        </div>
        <div class="skeleton-line skeleton"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// 定义 props，允许父组件传入要显示的骨架项数量
defineProps({
  count: {
    type: Number,
    default: 10, // 默认显示 5 条
  },
  text: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
/* 整个骨架屏列表的容器 */
.message-list-skeleton {
  background-color: #fff0;
}
/* 单个骨架项 */
.skeleton-item {
  display: flex;
  position: relative;
  align-items: center;
  box-sizing: border-box;
  // height: 128rpx;
}
.skeleton-item::after {
  position: absolute;
  left: 148rpx;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: #dbdbdb;
  content: '';
  transform: scaleY(0.3);
}
/* 左侧头像骨架 */
.skeleton-avatar {
  border-radius: 50%; /* 圆形 */
  width: 96rpx;
  height: 96rpx;
}
/* 右侧内容容器 */
.skeleton-content {
  flex: 1; /* 占据剩余所有空间 */
}
/* 内容行骨架 */
.skeleton-line {
  margin-bottom: 10px;
  border-radius: 4px;
  height: 32rpx;
}
.skeleton-line:last-child {
  margin-bottom: 0;
}
/* 短一点的内容行 */
.skeleton-line.short {
  width: 30%;
}
/*
 * 核心：闪烁动画效果
 * 我们给所有需要动画的元素（头像、文本行）添加 .skeleton 类
*/
.skeleton {
  overflow: hidden; /* 隐藏伪元素超出部分 */
  position: relative;
  /* 骨架屏的基础颜色 */
  background-color: #f0f2f5;
}
/* 使用伪元素 ::before 来创建移动的亮光 */
.skeleton::before {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* 亮光效果：使用线性渐变，中间是亮的，两边是透明的 */
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  content: '';
  /* 定义动画 */
  animation: shimmer 1.5s infinite linear;
}
/* 定义动画关键帧 */
@keyframes shimmer {
  0% {
    /* 从左边完全看不见的位置开始 */
    transform: translateX(-100%);
  }
  100% {
    /* 移动到右边完全看不见的位置结束 */
    transform: translateX(100%);
  }
}
</style>
