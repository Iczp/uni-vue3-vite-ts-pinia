<template>
  <div
    class="bouncing-scroll-wrapper"
    ref="wrapperRef"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @scroll="handleScroll"
  >
    <div class="bouncing-scroll-content" ref="contentRef">
      <!-- 下拉刷新指示器 -->
      <div v-if="props.enablePullToRefresh" class="pull-refresh-indicator">
        <slot name="pull-refresh-indicator" :state="pullRefreshState">
          <!-- 默认 UI -->
          <div v-if="pullRefreshState === 'loading'" class="loading-spinner"></div>
          <span v-else>{{ pullRefreshText }}</span>
        </slot>
      </div>

      <!-- 主要内容 -->
      <slot></slot>

      <!-- 上拉加载指示器 -->
      <div v-if="props.enableLoadMore" class="load-more-indicator">
        <slot
          name="load-more-indicator"
          :isLoading="props.isLoadingMore"
          :noMore="props.noMoreData"
        >
          <!-- 默认 UI -->
          <div v-if="props.isLoadingMore" class="loading-spinner"></div>
          <span v-else-if="props.noMoreData">没有更多数据了</span>
          <span v-else></span>
          <!-- 可以留空或显示 "上拉加载更多" -->
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- 组件 API 定义 ---
const props = defineProps({
  enablePullToRefresh: { type: Boolean, default: false },
  enableLoadMore: { type: Boolean, default: false },
  isLoadingMore: { type: Boolean, default: false },
  noMoreData: { type: Boolean, default: false },
});

const emit = defineEmits(['refresh', 'loadMore']);

// --- 平台检测 ---
const isAndroid = /android/i.test(navigator.userAgent);
console.log('isAndroid:', isAndroid);
// --- Refs ---
const wrapperRef = ref(null);
const contentRef = ref(null);

// --- 状态管理 ---
// 回弹效果
const startY = ref(0);
const isDragging = ref(false);

// 下拉刷新
const PULL_REFRESH_THRESHOLD = 70; // 触发刷新的下拉距离 (px)
const PULL_REFRESH_LOADING_Y = 50; // 加载时内容停留的位置 (px)
const pullRefreshState = ref('pulling'); // pulling, triggered, loading

// --- 计算属性 ---
const pullRefreshText = computed(() => {
  switch (pullRefreshState.value) {
    case 'pulling':
      return '↓ 下拉刷新';
    case 'triggered':
      return '↑ 释放刷新';
    default:
      return '↓ 下拉刷新';
  }
});

// --- 核心逻辑 ---
const isAtTop = () => wrapperRef.value?.scrollTop === 0;
const isAtBottom = () => {
  if (!wrapperRef.value) return false;
  const el = wrapperRef.value;
  // 增加 1px 缓冲，避免像素计算误差
  return Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight - 1;
};

const handleTouchStart = event => {
  if (event.touches.length !== 1) return;

  startY.value = event.touches[0].clientY;
  isDragging.value = false;

  if (contentRef.value) {
    contentRef.value.style.transition = 'none';
  }
};

const handleTouchMove = event => {
  if (event.touches.length !== 1) return;
  const deltaY = event.touches[0].clientY - startY.value;

  // 必须在顶部且向下拉
  if (!isAtTop() || deltaY < 0) return;

  // 阻止默认行为（页面滚动、Android辉光）
  event.preventDefault();
  isDragging.value = true;

  const translateY = isAndroid ? deltaY * 0.3 : deltaY; // Android上加阻尼

  // 更新下拉刷新状态
  if (props.enablePullToRefresh && pullRefreshState.value !== 'loading') {
    pullRefreshState.value = translateY > PULL_REFRESH_THRESHOLD ? 'triggered' : 'pulling';
  }

  // 应用位移
  if (contentRef.value) {
    contentRef.value.style.transform = `translateY(${translateY}px)`;
  }
};

const handleTouchEnd = () => {
  if (!isDragging.value) return;

  // 处理下拉刷新
  if (props.enablePullToRefresh && pullRefreshState.value === 'triggered') {
    pullRefreshState.value = 'loading';
    emit('refresh');
    // 保持加载指示器可见
    if (contentRef.value) {
      contentRef.value.style.transition = 'transform 0.3s ease-out';
      contentRef.value.style.transform = `translateY(${PULL_REFRESH_LOADING_Y}px)`;
    }
  } else {
    // 否则，执行普通回弹
    resetContentPosition();
  }

  isDragging.value = false;
};

// 上拉加载更多逻辑
const handleScroll = () => {
  if (!props.enableLoadMore || props.isLoadingMore || props.noMoreData || !isAtBottom()) {
    return;
  }
  emit('loadMore');
};

// --- 辅助函数 ---
const resetContentPosition = () => {
  if (contentRef.value) {
    contentRef.value.style.transition = 'transform 0.3s ease-out';
    contentRef.value.style.transform = 'translateY(0)';
    if (props.enablePullToRefresh) {
      pullRefreshState.value = 'pulling';
    }
  }
};

// --- 暴露给父组件的方法 ---
defineExpose({
  finishPullToRefresh: () => {
    // 外部调用此方法，结束刷新状态
    resetContentPosition();
  },
});
</script>

<style scoped>
.bouncing-scroll-wrapper {
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
}
/* 在iOS上禁用原生的下拉回弹，因为我们自己实现了刷新逻辑 */
.bouncing-scroll-wrapper:has(.pull-refresh-indicator) {
  overscroll-behavior-y: contain;
}
.bouncing-scroll-content {
  position: relative;
  background-color: inherit; /* 继承父容器背景色 */
}
/* 下拉刷新指示器样式 */
.pull-refresh-indicator {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  justify-content: center;
  align-items: center;
  height: 50px;
  font-size: 14px;
  color: #666;
  transform: translateY(-100%);
}
/* 上拉加载指示器样式 */
.load-more-indicator {
  padding: 15px 0;
  text-align: center;
  font-size: 14px;
  color: #666;
}
/* 简单的加载中 spinner 动画 */
.loading-spinner {
  border: 2px solid #ccc;
  border-top-color: #333;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
