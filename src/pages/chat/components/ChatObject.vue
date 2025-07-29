<template>
  <div
    class="flex gap-8 *:items-center  flex-shrink-0"
    :class="{ 'flex-col justify-center': vertical, 'flex-row': !vertical }"
  >
    <Avatar :item="item" />
    <slot>
      <div class="text-ellipsis text-align-center  h-24" :class="{ 'max-w-56': vertical }">
        <span v-if="labelValue">{{ labelValue }}</span>
        <span v-else class="flex flex-1 skeleton skeleton-line h-14 w-48"></span>
      </div>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import Avatar from './Avatar.vue';

const props = defineProps({
  item: {
    type: Object as () => Chat.ChatObjectDto | undefined,
  },
  label: {
    type: [String],
    default: null,
  },
  vertical: {
    type: [Boolean],
    default: false,
  },
});

const labelValue = computed(() => {
  return props.label || props.item?.name || props.item?.displayName || '';
});
</script>
