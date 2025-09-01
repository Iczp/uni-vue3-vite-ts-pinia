<template>
  <div class="session-unit gap-12" :class="{ toping: isToping }">
    <Avatar :size="48" :objectType="objectType" :item="item?.destination" class="text-24" />
    <div class="flex flex-1 flex-col">
      <div class="flex flex-row justify-between w-full gap-8 h-24 items-center text-14">
        <div class="text-15 text-ellipsis max-w-160">
          {{ index }} - {{ item?.destination?.name }}
        </div>
        <div class="text-ellipsis max-w-100 text-gray-300 text-12">
          <TimeAgo :time="item?.lastMessage?.creationTime" />
        </div>
      </div>
      <div class="flex flex-row justify-between gap-8 h-24 items-center text-12">
        <div class="text-ellipsis text-gray-400 max-w-220">
          <!-- 免打扰时的 未读数 -->
          <span v-if="isImmersed && badge > 0">[{{ badge }}条]</span>

          <!-- @我 -->
          <span v-if="remindCount > 0" class="remind">
            {{ Number(remindCount) > 99 ? '99+' : remindCount }}@我
          </span>

          <!-- 我关注的 flowing -->
          <span v-if="followingCount > 0" class="following" :title="followingCount.toString()">
            <!-- <HeartFilled /> -->
            {{ followingCount }}关注
          </span>

          <!-- 发送人信息 -->
          <span v-if="isShowSender" class="sender text-ellipsis max-w-40">
            {{ displaySenderName }}
          </span>

          <!--消息类型-->
          <span v-if="preview.contentType" class="message-type" :message-type="item?.messageType">
            {{ preview.contentType }}
          </span>

          <!-- 消息内容 -->
          <span>{{ preview.contentText }}</span>
        </div>
        <div class="flex flex-row items-center gap-4 shrink-0">
          <div v-if="isToping" class="text-gray-400 i-ic:baseline-star"></div>
          <div v-if="isImmersed" class="text-gray-400 i-ic:baseline-notifications-off"></div>
          <!-- <div v-if="item?.badge" class="badge">{{ item?.badge || 0 }}</div> -->
          <Badge :count="badge" :dot="isImmersed && badge > 0" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import TimeAgo from './TimeAgo.vue';
import Avatar from './Avatar.vue';
import Badge from './Badge.vue';
import { MessageTypes, ObjectTypes } from '@/utils/enums';
import { formatMessageContent, getSenderNameForMessage } from '@/utils/messageHelper';
const props = defineProps({
  item: {
    type: Object as () => Chat.SessionUnitDto,
    default: () => ({}),
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const remindMeCount = computed(() => props.item?.remindMeCount || 0);

const remindAllCount = computed(() => props.item?.remindAllCount || 0);

const remindCount = computed(() => remindMeCount.value + remindAllCount.value);
const followingCount = computed(() => props.item?.followingCount || 0);

const messageType = computed(
  () => props.item?.lastMessage?.messageType as MessageTypes | undefined,
);

const isSelfSender = computed(
  () => props.item?.id == props.item?.lastMessage?.senderSessionUnit?.id,
);

const isShowSender = computed(() => senderName.value && messageType.value != MessageTypes.Cmd);

const displaySenderName = computed(() => (isSelfSender.value ? '我' : senderName.value));

const badge = computed(() => props.item?.publicBadge || 0);

const senderName = computed(() => getSenderNameForMessage(props.item?.lastMessage));

const objectType = computed(() => props.item?.destination?.objectType as ObjectTypes);

const isImmersed = computed(() => props.item?.setting?.isImmersed);
const isToping = computed(() => Number(props.item?.sorting) > 0);

const preview = computed(() => formatMessageContent(props.item.lastMessage));

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
.toping {
  background-color: #f0f0f0;
}
.session-unit:hover {
  background-color: #f5f5f5;
}
.session-unit:active {
  background-color: #e4e4e4;
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
.remind {
  display: inline-flex;
  margin-right: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  background: #eea40e;
  box-shadow: 0 0 0 1px #fff;
  color: white;
  /* font-size: 12px; */
}
.following {
  display: inline-flex;
  align-items: center;
  margin-right: 4px;
  padding: 2px 4px;
  border-radius: 4px;
  background: #f64dff;
  color: white;
}
.sender {
  color: var(--session-item-sender-color, #757575);
}
.sender::after {
  margin: 0 2px;
  color: var(--session-item-sender-after-color, #757575);
  content: ':';
}
.message-type {
  margin-right: 4px;
  color: var(--preview-message-type-color, #666);
}
.flash {
  animation: flash 0.5s infinite;
}
@keyframes flash {
  from {
    background: rgba(255, 0, 0, 0.637);
  }
  to {
    background: rgba(255, 0, 0, 0);
  }
}
</style>
