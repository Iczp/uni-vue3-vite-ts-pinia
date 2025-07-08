<template>
  <div class="current-chat-object flex flex-row items-center gap-4">
    <u-avatar :src="current.thumbnail" :size="40"></u-avatar>
    <span class="text-15 font-bold text-ellipsis max-w-88">{{ current.name }}</span>
    <i class="i-ic:round-keyboard-arrow-down"></i>
  </div>
</template>
<script lang="ts" setup>
import { useChatObjectStore } from '@/store/chatObjectStore';
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
});
const store = useChatObjectStore();
const current = computed(() => store.current);
</script>
<style lang="scss" scoped></style>
