<template>
  <div
    class="current-chat-object flex flex-row items-center gap-4 position-relative"
    @click="showPopup"
  >
    <ChatObject :size="28" :border="false" :item="current">
      <template #title>
        <div class="text-15 font-bold text-ellipsis max-w-120">{{ current.name }}</div>
      </template>
      <template v-if="isMany" #actions>
        <i v-if="isMany" class="i-ic:round-keyboard-arrow-down"></i>
      </template>
    </ChatObject>
    <Badge :count="store.otherBadges" class="absolute"></Badge>
    <!-- <div class="badge absolute" @click="increment">{{ count }}</div> -->

    <!-- <u-avatar :src="current.thumbnail" :size="40"></u-avatar> -->

    <!-- <i v-if="isMany" class="i-ic:round-keyboard-arrow-down"></i> -->
  </div>
</template>
<script lang="ts" setup>
import { useChatStore } from '@/store/chatStore';
import Badge from '@/pages/im/components/Badge.vue';
import ChatObject from '@/pages/im/components/ChatObject.vue';
const props = defineProps({
  theme: {
    type: String,
    default: 'light',
  },
});
const store = useChatStore();
const isMany = computed(() => store.chatObjects.length > 1);
const current = computed(() => store.current);

const showPopup = () => {
  uni.$emit('showPopup@chat-index', true);
};
const count = ref(8);
const increment = () => {
  count.value++;
};
</script>
<style lang="scss" scoped>
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 2rpx 10rpx;
  border: 1px solid white;
  border-radius: 36rpx;
  min-width: 36rpx;
  // min-height: 36rpx;
  background-color: #ff4500;
  font-size: 24rpx;
  color: white;
}
.badge.absolute {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  transform: translate(50%, -50%);
}
</style>
