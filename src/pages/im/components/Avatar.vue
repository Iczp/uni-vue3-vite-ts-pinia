<template>
  <div class="avatar-wrapper relative flex flex-shrink-0" :style="containerCss">
    <TagCreator
      v-if="!isSkeleton && isCreator"
      class="absolute left-[50%] bottom-0 translate-[-50%,50%] z-9"
    />
    <div class="avatar-container text-20 w-full h-full flex-shrink-0">
      <div v-if="!isSkeleton && item?.serviceStatus === 1" class="online-status">
        <div class="status-dot status-1"></div>
      </div>

      <!-- {{ item }} -->

      <div v-if="isSkeleton" class="w-full h-full skeleton flex flex-center rounded-full">
        <i class="text-24 text-gray-200 i-ic:baseline-person"></i>
      </div>

      <image
        v-else-if="imgSrc"
        :width="size"
        :height="size"
        :art="src"
        :src="imgSrc"
        class="avatar-image fade-in"
        :class="{ loaded: isImgLoaded }"
        @load="onImgLoad"
      ></image>
      <block v-else>
        <i v-if="objectType == ObjectTypes.Room" class="i-ic:baseline-group"></i>
        <i v-else-if="objectType == ObjectTypes.Robot" class="i-ic:round-smart-toy"></i>
        <i v-else-if="objectType == ObjectTypes.Subscription" class="i-ic:outline-spa"></i>
        <i v-else-if="objectType == ObjectTypes.Official" class="i-ic:round-spa"></i>
        <i v-else-if="objectType == ObjectTypes.ShopKeeper" class="i-ic:round-shopify"></i>
        <i v-else-if="objectType == ObjectTypes.ShopWaiter" class="i-ic:round-shopify"></i>
        <i v-else-if="objectType == ObjectTypes.Square" class="i-ic:round-chat"></i>
        <i v-else-if="objectType == ObjectTypes.Anonymous" class="i-ic:round-person-outline"></i>
        <i v-else-if="objectType == ObjectTypes.Personal" class="i-ic:baseline-person"></i>
        <i v-else class="i-ic:baseline-person"></i>
      </block>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ObjectTypes } from '@/utils/enums';
import TagCreator from './TagCreator.vue';
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
    default: null,
  },
  item: {
    type: Object as () => Chat.ChatObjectDto | undefined,
  },
  isCreator: {
    type: Boolean,
    default: false,
  },
});

const isSkeleton = computed(() => !props.item);

const containerCss = computed(() => {
  return {
    width: `${props.size * 2}rpx`,
    height: `${props.size * 2}rpx`,
    '--avatar-size': `${props.size * 2}rpx`,
    '--side-border-color': 'white',
    '--bg-color': '#e5e5e5',
  };
});
const imgSrc = computed(() => {
  const src = props.src || props.item?.thumbnail || props.item?.portrait;
  if (!src) return null;
  const regex = /^(https?:\/\/)/;
  if (regex.test(src)) {
    return src;
  } else if (src?.startsWith('/')) {
    return `${import.meta.env.VITE_CHAT_BASE_URL}${src}`;
  }
  return `${src}`;
});

const isImgLoaded = ref(false);
const iconClass = computed(() => {
  return '';
});

const onImgLoad = e => {
  // console.log('图片加载完成', e);
  isImgLoaded.value = true;
  // 图片加载完成后，将不透明度设置为1
  // e.target.classList.add('loaded');
};
</script>
<style lang="scss" scoped>
:where(.avatar-container) {
  --side-border-color: #c5ed26;
  --avatar-size: 88rpx;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 50%;
  // width: 96rpx;
  // height: 96rpx;
  background-color: #e5e5e5;
  color: #999;
}
.online-status {
  display: flex;
  position: absolute;
  /* 计算135度位置 */
  right: calc(50% - 0.7071 * var(--avatar-size, 88rpx) / 2); /* cos(135°) * radius */
  bottom: calc(50% - 0.7071 * var(--avatar-size, 88rpx) / 2); /* sin(135°) * radius */
  z-index: 1;
  flex-shrink: 0;
  border: 1px solid var(--side-border-color);
  border-radius: 50%;
  width: 8px;
  height: 8px;
  background-color: rgba(24, 205, 24, 0.794);
  transform: translate(50%, 50%);
  // margin: 2px;
}
.status-0 {
  background-color: rgba(138, 138, 138, 0.494);
}
.status-1 {
  background-color: rgba(24, 205, 24, 0.794);
}
.status-2 {
  background-color: rgba(48, 108, 247, 0.775);
}
.status-3 {
  background-color: rgba(217, 203, 6, 0.775);
}
.status-4 {
  background-color: rgba(134, 134, 134, 0.713);
}
.avatar-image {
  border-radius: 50%;
  width: 100%;
  height: 100%;
}
.fade-in {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.loaded {
  opacity: 1; /* 当图片加载完成时，将不透明度设置为 1 */
}
</style>
