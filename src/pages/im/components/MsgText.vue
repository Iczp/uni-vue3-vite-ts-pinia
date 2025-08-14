<template>
  <Bubble :r="reverse" class="msg-text" :class="{ self: reverse }">
    <TextRender :value="text" @word-click="onWordClick" />
  </Bubble>
</template>
<script lang="ts" setup>
import Bubble from './Bubble.vue';
import TextRender from './TextRender.vue';
import { type WordDto } from '@/utils/formatWords';
const props = defineProps({
  item: {
    type: Object as () => Chat.MessageDto,
    default: () => {},
  },
  reverse: {
    type: Boolean,
    default: false,
  },
});

const content = computed(() => props.item.content as Chat.TextContentDto);

const text = computed(() => content.value.text || '');
const onWordClick = (item: WordDto, event?: Event) => {
  console.log('onWordClick', item, event);
};
</script>

<style lang="scss" scoped>
.msg-text {
  box-sizing: border-box;
  padding: 24rpx;
  min-width: 80rpx;
  // max-width: calc(100% - 128rpx);
  // max-width: 420rpx;
  min-height: 80rpx;
  background-color: var(--msg-text-background-color);
  background-repeat: no-repeat;
  line-height: 150%;
  // line-height: 24px;
  // background: var(--msg-text-background);
  font-size: 28rpx;
  color: var(--msg-text-color);
}
.msg-text:hover {
  background: var(--msg-text-hover-background);
  background-color: var(--msg-text-hover-background-color);
  color: var(--msg-text-hover-color);
}
.msg-text.self {
  background: var(--msg-text-self-background);
  background-color: var(--msg-self-text-background-color);
  color: var(--msg-text-self-color);
}
.msg-text.self:hover {
  background: var(--msg-text-self-hover-background);
  background-color: var(--msg-self-text-hover-background-color);
  color: var(--msg-text-self-hover-color);
}
</style>
