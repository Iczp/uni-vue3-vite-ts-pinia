<template>
  <div class="chat-demo">
    <!-- <div class="toolbar">
      <button v-if="!streaming" @click="startStream()">Start stream</button>
      <button v-else @click="stopStream()">Stop stream</button>

      <input v-model="search" placeholder="Filter..." />
    </div> -->
    <div class="position-absolute bottom-60 right-20 z-10" @click="onSend">ddd</div>
    <!-- <PullRefresh v-model:loading="isPending"> -->
    <DynamicScroller
      ref="scrollerRef"
      :items="messageList"
      :min-item-size="54"
      @scroll="onScroll"
      @scroll-start="handleScrollToTop"
      @scroll-end="handleScrollToBottom"
      @resize="onResize"
      class="scroller"
    >
      <template #before>
        <div class="notice">The message heights are unknown.</div>

        <Loading
          v-if="messageList.length == 0 && isPending"
          text="正在收取消息..."
          class="text-12"
        />
      </template>

      <!-- <template #after=>
        <div class="notice">footer.</div>
      </template> -->

      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item]"
          :data-index="index"
          :data-active="active"
          :title="`Click to change message ${index}`"
          class="message"
          @click="changeMessage(item)"
        >
          <MessageItem
            :item="item"
            :index="index"
            :active="active"
            :senderSessionUnitId="sessionUnitId"
          />
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
    <!-- </PullRefresh> -->
  </div>
</template>
<script lang="ts" setup>
import MessageItem from './MessageItem.vue';
import Loading from './Loading.vue';
import { getMessageList } from '@/api/chatApi';
import PullRefresh from './PullRefresh.vue';
import app from '@/store/app';
const props = defineProps({
  sessionUnitId: {
    type: [String],
    // required: true,
  },
  title: {
    type: String,
    default: '',
  },
});
const route = getApp().$route;
console.log('route', route);

const title = ref(props.title);
const isPending = ref(false);
const messageList = ref<Chat.MessageDto[]>([]);
const scrollerRef = ref();
const maxMessageId = ref<number | null>();
const onSend = () => {
  const items = Array.from({ length: 3 }).map((_, i) => ({
    id: maxMessageId.value! + 1 + i,
    content: {
      text: `${maxMessageId.value! + 1 + i}`,
    },
  }));
  messageList.value = messageList.value.concat(items);
  maxMessageId.value = maxMessageId.value! + items.length;
  nextTick(() => {
    scrollToBottom();
  });
};

const scrollToBottom1 = () => {
  const scrollerEl = scrollerRef.value?.$el; // 获取 scroller 组件的根 DOM 元素
  if (scrollerEl) {
    scrollerEl.scrollTo({
      top: scrollerEl.scrollHeight, // 滚动到总高度的位置，即最底部
      behavior: 'smooth', // ✨ 核心：开启平滑滚动动画
    });
  }
};
const fetchLatest = async () => {
  if (isPending.value) return;
  isPending.value = true;
  getMessageList({
    sessionUnitId: props.sessionUnitId,
    maxMessageId: null,
    maxResultCount: 20,
    skipCount: 0,
  })
    .then(res => {
      maxMessageId.value = res.items[0].id;
      messageList.value = messageList.value.concat(res.items);
      // scrollToBottom();
    })
    .finally(() => {
      isPending.value = false;
    });
};
const scrollToBottom = () => {
  scrollerRef.value?.scrollToBottom();
};
const scrollToTop = () => {
  scrollerRef.value?.scrollToTop();
};
fetchLatest();
const changeMessage = item => {
  item.message = `Message ${Math.floor(Math.random() * 100)}`;
};
const handleScrollToTop = e => {
  // fetchLatest();
  console.log('handleScrollToTop', e);
};
const handleScrollToBottom = e => {
  console.log('handleScrollToBottom', e);
};
const onResize = e => {
  console.log('onResize', e);
};
const onScroll = e => {
  // console.log('onScroll', e);
};
</script>

<style scoped>
.chat-demo {
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: column;
  flex: auto 1 1;
}
.scroller {
  flex: auto 1 1;
}
.notice {
  padding: 24px;
  font-size: 20px;
  color: #999;
}
.message {
  display: flex;
  box-sizing: border-box;
  /* padding: 12px; */
  /* min-height: 44px; */
}
.avatar {
  flex: auto 0 0;
  margin-right: 12px;
  border-radius: 50%;
  width: 32px;
  height: 32px;
}
.avatar .image {
  border-radius: 50%;
  max-width: 100%;
  max-height: 100%;
}
.index,
.text {
  flex: 1;
}
.text {
  max-width: 400px;
}
.index {
  opacity: 0.5;
}
.index span {
  display: inline-block;
  width: 160px;
  text-align: right;
}
</style>
