<template>
  <div class="time-ago">{{ formattedTime }}</div>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, watch, onUnmounted } from 'vue';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
// 定义接收时间参数的 prop
const props = defineProps({
  time: {
    type: [Date, String, null],
    required: false,
  },
});

// 响应式引用，用于存储当前的时间格式
const currentTimeFormat = ref('');

// 计算属性：格式化时间
const formattedTime = computed(() => {
  return currentTimeFormat.value;
});

// 定时器 ID，用于清除定时器
let timerId: number | null = null;

// 定时器函数，定期更新时间格式
const updateTimeFormat = () => {
  let timeFormat = formatTimeAgo(props.time);
  if (currentTimeFormat.value !== timeFormat) {
    currentTimeFormat.value = timeFormat;
  }
};

// 初始化时间格式
updateTimeFormat();

// 设置定时器，
timerId = setInterval(updateTimeFormat, 10 * 1000);

const removeTimer = () => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
};

// 组件卸载时清除定时器
onUnmounted(() => {
  removeTimer();
});
</script>

<style lang="scss" scoped>
.time-ago {
  font-size: 12px;
  color: #999;
}
</style>
