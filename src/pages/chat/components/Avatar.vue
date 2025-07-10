<template>
  <div class="avatar-container">
    <image
      v-if="src"
      :width="size"
      :height="size"
      :art="src"
      :src="imageSrc"
      class="avatar-image"
    ></image>
    <block v-else>
      <i v-if="objectType == ObjectTypes.Room" class="i-ic:baseline-group"></i>
      <i v-else-if="objectType == ObjectTypes.Official" class="i-ic:baseline-group"></i>
      <i v-else class="i-ic:baseline-person"></i>
    </block>
  </div>
</template>
<script lang="ts" setup>
import { ObjectTypes } from '@/utils/enums';
// import { ObjectTypes } from '@/@types/chatApi.d.ts';
const props = defineProps({
  size: {
    type: [Number],
    default: 48,
    required: true,
  },
  src: {
    type: [String],
  },
  objectType: {
    type: Number as PropType<ObjectTypes>,
    default: () => ObjectTypes.Personal,
  },
});
const imageSrc = computed(() => {
  if (props.src?.startsWith('http://') || props.src?.startsWith('https://')) {
    return props.src;
  } else if (props.src?.startsWith('/')) {
    return `${import.meta.env.VITE_CHAT_BASE_URL}${props.src}`;
  }
  return `${props.src}`;
});
const iconClass = computed(() => {
  return '';
});
</script>
<style lang="scss" scoped>
.avatar-image {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
:where(.avatar-container) {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  width: 96rpx;
  height: 96rpx;
  background-color: #e5e5e5;
  color: #999;
}
</style>
