<template>
  <div
    class="pull-refresh-wrapper"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @touchcancel="onTouchEnd"
  >
    <!-- 1. 刷新指示器 -->
    <div class="pull-refresh-indicator" :style="indicatorStyle">
      <slot name="indicator" :status="status">
        <!-- 默认的指示器UI -->
        <span v-if="status === 'pulling'" class="arrow" :class="{ 'arrow-up': diffY > threshold }">
          ↓
        </span>
        <span v-if="status === 'loading'" class="loading-spinner"></span>
        <span class="text">{{ indicatorText }}</span>
      </slot>
    </div>

    <!-- 2. 内容区域，通过插槽传入 -->
    <div ref="contentRef" class="pull-refresh-content" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';

// 定义 Props
const props = defineProps({
  // 通过 v-model:loading 控制加载状态
  loading: {
    type: Boolean,
    required: true,
  },
  // 触发刷新的阈值
  threshold: {
    type: Number,
    default: 56,
  },
  // 阻尼系数 (0-1)，越小阻力越大
  dampingFactor: {
    type: Number,
    default: 0.8,
  },
  // 刷新指示器在加载时停留的高度
  headHeight: {
    type: Number,
    default: 50,
  },
});

// 定义 Emits
const emit = defineEmits(['refresh', 'update:loading']);

// 内部状态
const pulling = ref(false); // 是否正在拖拽
const startY = ref(0);
const diffY = ref(0); // 经过阻尼计算后的下拉距离
const status = ref('normal'); // 'normal', 'pulling', 'releasing', 'loading'

// DOM 引用
const contentRef: Ref<HTMLElement | null> = ref(null); // 内容区域的引用
const scrollableEl: Ref<HTMLElement | null> = ref(null); // 真正滚动的元素

// 在组件挂载后，找到插槽中真正的滚动元素
// 假设它是内容区域的第一个子元素
onMounted(() => {
  if (contentRef.value?.firstElementChild) {
    scrollableEl.value = contentRef.value.firstElementChild as HTMLElement;
  } else {
    console.warn('[PullRefresh] No scrollable element found in the slot.');
  }
});

// 计算属性
const indicatorText = computed(() => {
  if (status.value === 'loading') return '加载中...';
  if (status.value === 'releasing') return '释放立即刷新';
  return '下拉可以刷新';
});

const indicatorStyle = computed(() => ({
  transition: pulling.value ? 'none' : 'transform 0.2s',
  transform: `translateY(${diffY.value}px)`,
}));

const contentStyle = computed(() => ({
  transition: pulling.value ? 'none' : 'transform 0.2s',
  transform: `translateY(${diffY.value}px)`,
}));

// Touch 事件处理
const onTouchStart = e => {
  if (props.loading || !scrollableEl.value) return;

  // 只有在滚动内容顶部时才触发
  if (scrollableEl.value.scrollTop === 0) {
    pulling.value = true;
    startY.value = e.touches[0].clientY;
    status.value = 'pulling';
  }
};

const onTouchMove = e => {
  if (!pulling.value) return;

  const currentY = e.touches[0].clientY;
  let rawDiff = currentY - startY.value;

  if (rawDiff < 0) {
    // 阻止上滑
    pulling.value = false;
    return;
  }

  e.preventDefault(); // 阻止浏览器默认行为

  // 应用阻尼效果
  diffY.value = Math.pow(rawDiff, props.dampingFactor);

  // 更新状态
  status.value = diffY.value > props.threshold ? 'releasing' : 'pulling';
};

const onTouchEnd = () => {
  if (!pulling.value) return;

  pulling.value = false;

  if (status.value === 'releasing') {
    // 触发刷新
    status.value = 'loading';
    diffY.value = props.headHeight; // 固定到加载高度
    emit('update:loading', true);
    emit('refresh');
  } else {
    // 未触发，弹回
    reset();
  }
};

const reset = () => {
  status.value = 'normal';
  diffY.value = 0;
};

// 监听父组件的 loading 状态变化
// 当父组件完成数据加载后，会将 loading 变为 false，此时我们重置组件状态
watch(
  () => props.loading,
  newVal => {
    if (!newVal && status.value === 'loading') {
      reset();
    }
  },
);
</script>

<style lang="scss" scoped>
.pull-refresh-wrapper {
  overflow: hidden;
  position: relative;
  /* 确保它有自己的高度上下文 */
  height: 100%;
}
.pull-refresh-indicator {
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: -50px; /* 默认的 headHeight */
  justify-content: center;
  align-items: center;
  height: 50px; /* 默认的 headHeight */
  font-size: 14px;
  color: #888;
}
.pull-refresh-indicator .text {
  margin-left: 8px;
}
.pull-refresh-content {
  overflow: auto;
  height: 100%;
}
/* 默认指示器样式 */
.arrow {
  display: inline-block;
  font-size: 18px;
  transition: transform 0.2s;
}
.arrow-up {
  transform: rotate(180deg);
}
.loading-spinner {
  border: 2px solid #c8c9cc;
  border-top-color: #4d8df6;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
