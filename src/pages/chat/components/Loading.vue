<template>
  <div class="flex flex-center text-gray text-12 p-12 gap-8">
    <slot name="icon"><i class="i-svg-spinners:dot-revolve"></i></slot>
    <slot>
      <span>{{ text }}</span>
    </slot>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  text: {
    type: String,
    default: '加载中...',
  },
});


</script>
