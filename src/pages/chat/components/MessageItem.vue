<template>
  <div
    ref="itemRef"
    class="message-item flex flex-col w-full gap-8"
    :class="{ reverse: isSelf }"
    @click="isSelf = !isSelf"
  >
    <slot name="header"></slot>
    <div class="flex flex-center text-gray-300 text-12 h-24">2022-22-22</div>
    <div class="flex flex-row message-layout px-10 gap-4">
      <Avatar :value="sender" :size="40" class="text-20"></Avatar>
      <div class="message-body flex flex-col flex-1 gap-4">
        <div class="sender-name-container text-12 px-12">
          <div class="sender-name">
            {{ senderName }}
          </div>
        </div>
        <div class="message-content text-14">
          <MsgText :item="item" :reverse="isSelf"></MsgText>
        </div>
      </div>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
import Avatar from './Avatar.vue';
import MsgText from './MsgText.vue';

// import { useElementVisibility } from '@vueuse/core';

const itemRef = ref<HTMLDivElement | null>(null);
// const targetIsVisible = useElementVisibility(itemRef);

const props = defineProps({
  // sessionUnitId
  item: {
    type: Object as () => Chat.MessageDto,
    default: null,
  },
  senderSessionUnitId: {
    type: String,
    default: '',
  },
  index: {
    type: Number,
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const sender = computed(() => props.item?.senderSessionUnit?.owner);
const senderName = computed(() => props.item?.senderName);
const isSelf = computed(() => props.item?.senderSessionUnit?.id === props.senderSessionUnitId);
</script>

<style lang="scss" scoped>
.reverse {
  // flex-direction: row-reverse;
  .message-layout {
    flex-direction: row-reverse;
  }
  .message-body {
    align-items: flex-end;
  }
}
</style>
