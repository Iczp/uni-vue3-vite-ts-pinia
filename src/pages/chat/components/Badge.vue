<template>
  <span class="badge" :class="[typeClass, sizeClass]">
    <!-- 数字变化时的滚动容器 -->
    <transition-group
      name="badge-scroll"
      tag="span"
      class="badge-count"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
    >
      <!-- 将数字拆分为单字符显示 -->
      <span
        v-for="(char, index) in currentChars"
        :key="`${char}-${index}-${keySuffix}`"
        class="badge-char"
      >
        {{ char }}
      </span>
    </transition-group>
  </span>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  count: {
    type: Number,
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
});

// 当前显示的数字字符数组
const currentChars = ref([]);
// 上一个显示的数字字符数组
const prevChars = ref([]);
// 用于强制重新渲染的关键后缀
const keySuffix = ref(0);

// 计算显示的数字（超过最大值显示 max+）
const displayCount = computed(() => {
  return props.count > props.max ? `${props.max}+` : `${props.count}`;
});

// 类型样式类
const typeClass = computed(() => `badge-${props.type}`);
// 尺寸样式类
const sizeClass = computed(() => `badge-${props.size}`);

// 观察 count 变化
watch(
  () => props.count,
  (newVal, oldVal) => {
    prevChars.value = [...currentChars.value];

    // 更新当前显示的字符
    currentChars.value = displayCount.value.toString().split('');

    // 如果数字长度变化，强制重新渲染
    if (prevChars.value.length !== currentChars.value.length) {
      keySuffix.value++;
    }
  },
);

// 初始化当前显示的数字
currentChars.value = displayCount.value.toString().split('');

// 动画钩子函数
const beforeEnter = el => {
  const index = [...el.parentNode.children].indexOf(el);
  const prevChar = prevChars.value[index] || '';
  const newChar = currentChars.value[index];

  // 设置初始位置（根据变化方向）
  if (prevChar !== newChar) {
    const direction = parseInt(newChar) > parseInt(prevChar || '0') ? 'up' : 'down';
    el.style.transform = direction === 'up' ? 'translateY(100%)' : 'translateY(-100%)';
    el.style.opacity = '0';
  }
};

const enter = (el, done) => {
  const index = [...el.parentNode.children].indexOf(el);
  const prevChar = prevChars.value[index] || '';
  const newChar = currentChars.value[index];

  if (prevChar !== newChar) {
    // 使用 requestAnimationFrame 确保动画流畅
    requestAnimationFrame(() => {
      el.style.transition = 'all 0.3s ease-in-out';
      requestAnimationFrame(() => {
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      });
    });

    // 动画结束后调用 done
    setTimeout(done, 300);
  } else {
    done();
  }
};

const afterEnter = el => {
  // 清除内联样式
  el.style.transform = '';
  el.style.opacity = '';
  el.style.transition = '';
};
</script>

<style lang="scss" scoped>
.badge {
  display: inline-block;
  position: relative;
  line-height: 1;
  vertical-align: middle;
}
.badge-count {
  display: inline-flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 0 6px;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
}
/* 类型样式 */
.badge-primary {
  background-color: #1677ff;
  color: white;
}
.badge-danger {
  background-color: #ff4d4f;
  color: white;
}
.badge-warning {
  background-color: #faad14;
  color: white;
}
.badge-success {
  background-color: #52c41a;
  color: white;
}
/* 尺寸样式 */
.badge-default {
  padding: 0 6px;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  font-size: 12px;
}
.badge-small {
  padding: 0 4px;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  font-size: 10px;
}
/* 字符容器 */
.badge-char {
  display: inline-block;
  overflow: hidden;
  position: relative;
  min-width: 1px;
  height: 100%;
  text-align: center;
}
/* 动画过渡 */
.badge-scroll-move {
  transition: transform 0.3s ease-in-out;
}
</style>
