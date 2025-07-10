<template>
  <div class="session-unit gap-12">
    <Avatar
      :size="48"
      :objectType="objectType"
      :src="item?.destination?.thumbnail"
      class="text-24"
    />
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row justify-between w-full gap-8 h-24 items-center text-14">
        <div class="text-15 text-ellipsis max-w-160">
          {{ item?.destination?.name }}
        </div>
        <div class="text-ellipsis max-w-100 text-gray-300 text-12">
          <TimeAgo :time="item?.lastMessage?.creationTime" />
        </div>
      </div>
      <div class="flex flex-row justify-between gap-8 h-24 items-center text-12">
        <div class="text-ellipsis max-w-220">
          <span class="text-gray-600">王总:</span>
          <!-- <span class="text-red">[图片]</span> -->
          <span class="text-gray-400">{{ messageText }}</span>
        </div>
        <div class="flex flex-row items-center gap-4 shrink-0">
          <div v-if="isFav" class="text-gray-500 i-ic:baseline-star"></div>
          <div v-if="isImmersed" class="text-gray-300 i-ic:baseline-notifications-off"></div>
          <div v-if="item?.badge" class="badge">{{ item?.badge || 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TimeAgo from './TimeAgo.vue';
import Avatar from './Avatar.vue';
import { ObjectTypes } from '@/utils/enums';
const props = defineProps({
  item: {
    type: Object as () => ChatApi.SessionUnitDto,
    default: () => ({}),
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const objectType = computed(() => props.item?.destination?.objectType as ObjectTypes);

const isImmersed = computed(() => props.item?.setting?.isImmersed);
const isFav = computed(() => Number(props.item?.sorting) > 0);

const messageText = computed(() => {
  return props.item?.lastMessage?.content?.text;
});
// const onSessionClick = () => {
//   console.log('onSessionClick', props.index, props.item);
//   props.item.badge = Number(props.item.badge || 0) + 1;
// };
</script>
<style lang="scss" scoped>
.session-unit {
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 24rpx;
}
.session-unit::after {
  position: absolute;
  left: 148rpx;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: #dbdbdb;
  content: '';
  transform: scaleY(0.3);
}
.badge {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  padding: 2rpx 10rpx;
  border: 1px solid white;
  border-radius: 36rpx;
  min-width: 36rpx;
  min-height: 36rpx;
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
