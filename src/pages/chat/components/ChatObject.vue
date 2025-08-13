<template>
  <div
    class="chat-object flex gap-8 flex-shrink-0 gap-12 items-center"
    :class="{ 'flex-col justify-center': vertical, 'flex-row': !vertical, border, active }"
  >
    <slot name="header">

    </slot>
    <slot name="icon">
      <Avatar :size="size" :item="item" />
    </slot>

    <slot>
      <div class="flex flex-1 flex-col justify-center gap-4">
        <slot name="title">
          <div
            class="flex justify-between items-center flex-1 h-24"
            :class="{ 'max-w-56': vertical }"
          >
            <slot name="title-left">
              <span class="text-ellipsis text-14" v-if="labelValue">{{ labelValue }}</span>
              <span v-else class="flex flex-1 skeleton skeleton-line h-14 w-48"></span>
            </slot>
            <slot name="title-right"></slot>
          </div>
        </slot>
        <slot name="desc">
          <div v-if="slots['desc']" class="flex flex-row justify-between items-center text-gray">
            <slot name="desc-left">
              <div class="text-ellipsis"></div>
            </slot>
            <slot name="desc-right">
              <div class="text-ellipsis"></div>
            </slot>
          </div>
        </slot>
      </div>
    </slot>
    <slot name="actions"></slot>
    <i v-if="arrow" class="text-gray-400 i-ic:round-arrow-forward-ios"></i>
  </div>
</template>
<script lang="ts" setup>
import Avatar from './Avatar.vue';

const props = defineProps({
  item: {
    type: Object as () => Chat.ChatObjectDto | undefined,
  },
  size: {
    type: [Number],
  },
  icon: {
    type: [String],
    default: null,
  },
  label: {
    type: [String],
    default: null,
  },
  vertical: {
    type: [Boolean],
    default: false,
  },
  border: {
    type: [Boolean],
    default: true,
  },
  active: {
    type: [Boolean],
    default: false,
  },
  arrow: {
    type: [Boolean],
    default: false,
  },
});
const slots = useSlots();

const labelValue = computed(() => {
  return props.label || props.item?.name || props.item?.displayName || '';
});
</script>

<style lang="scss" scoped>
.chat-object {
  position: relative;
}
.active:hover {
  background-color: #f5f5f5;
}
.active:active {
  background-color: #e4e4e4;
}
.border {
  position: relative;
}
:where(.border)::after {
  position: absolute;
  left: 136rpx;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: #dbdbdb;
  content: '';
  transform: scaleY(0.3);
}
</style>
