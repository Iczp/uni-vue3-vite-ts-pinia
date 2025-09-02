<template>
  <div
    ref="itemRef"
    class="message-item flex flex-col w-full gap-8"
    :class="{ reverse: isSelf, selected: isSelected, selector: isSelector }"
  >
    <slot name="header"></slot>
    <div class="flex flex-center text-gray-300 text-12 h-24">2022-22-22</div>

    <div class="flex flex-row px-12 gap-12 line-container">
      <div v-if="isSelector" class="flex w-32 box-border justify-center">
        <checkbox :checked="isSelected" />
      </div>
      <div class="message-layout flex flex-1 flex-row gap-4">
        <Avatar
          :item="sender?.owner"
          :size="44"
          class="text-20"
          :isCreator="sender?.setting?.isCreator"
          @click="emit('profile', sender)"
        ></Avatar>
        <div class="message-body flex flex-col flex-1 gap-4">
          <div v-if="isShowSenderName" class="sender-name-container max-w-120 text-12 px-12">
            <div class="sender-name text-ellipsis">{{ senderName }} {{ item.id }}</div>
          </div>
          <div class="message-content text-14">
            <MsgText :item="item" :reverse="isSelf"></MsgText>
          </div>
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
const emit = defineEmits(['profile']);
const props = defineProps({
  // sessionUnitId
  isSelector: {
    type: Boolean,
    default: false,
  },

  item: {
    type: Object as () => Chat.MessageDto,
    default: null,
  },
  senderId: {
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

const isSelected = ref(false);
const sender = computed(() => props.item?.senderSessionUnit);
const senderName = computed(() => props.item?.senderName);
const isSelf = computed(() => props.item?.senderSessionUnit?.id === props.senderId);
const isShowSenderName = computed(() => !isSelf.value);
</script>

<style lang="scss" scoped>
.reverse {
  // flex-direction: row-reverse;
  .message-layout {
    flex-direction: row-reverse;
  }
  .line-container {
    justify-content: flex-end;
  }
  .message-body {
    align-items: flex-end;
  }
}
.selector {
  // .message-layout {
  //   max-width: calc(100% - 48px);
  // }
}
.message-layout {
  max-width: calc(100% - 96rpx);
}
</style>
