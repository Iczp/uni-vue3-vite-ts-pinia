<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  name: string; // 如 "mdi-home"、"tabler-settings"
  size?: string | number; // 如 "2xl" 或 "24"（px）
  color?: string; // UnoCSS 类名或十六进制颜色
  class?: string;
}>();

const iconClass = computed(() => {
  const base = `i-${props.name}`;
  const sizeClass = typeof props.size === 'string' ? `text-${props.size}` : ''; // 数值将用 style 设置
  const colorClass = props.color?.startsWith('#')
    ? '' // 颜色是自定义值
    : props.color
    ? `text-${props.color}`
    : '';

  return [base, sizeClass, colorClass, props.class].filter(Boolean).join(' ');
});

const style = computed(() =>
  typeof props.size === 'number' || props.color?.startsWith('#')
    ? {
        fontSize: typeof props.size === 'number' ? `${props.size}px` : undefined,
        color: props.color?.startsWith('#') ? props.color : undefined,
      }
    : undefined,
);
</script>

<template>
  <i :class="iconClass" :style="style" />
</template>
