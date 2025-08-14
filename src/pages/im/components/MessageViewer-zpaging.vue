<!-- 聊天记录模式演示(vue)，加载更多聊天记录无闪动 -->
<!-- nvue的聊天记录模式中需要写@cellStyleChange="cellStyleChange"，如果需要兼容nvue和vue，请以nvue中写法为准，会自动兼容vue -->
<!-- 注意，此写法由于将列表倒置了，在iOS15以下和部分较低版本安卓中可能出现列表无法滚动的问题，此时建议使用z-paging 2.7.0以下的版本及写法 -->
<template>
  <view class="content">
    <!-- use-chat-record-mode：开启聊天记录模式 -->
    <!-- safe-area-inset-bottom：开启底部安全区域适配 -->
    <!-- bottom-bg-color：设置slot="bottom"容器的背景色，这里设置为和chat-input-bar的背景色一致 -->
    <z-paging
      ref="paging"
      class="z-paging"
      v-model="messageList"
      use-chat-record-mode
      safe-area-inset-bottom
      bottom-bg-color="#f8f8f8"
      @query="queryList"
      @onRefresh="onRefresh"
      @keyboardHeightChange="keyboardHeightChange"
      @hidedKeyboard="hidedKeyboard"
    >
      <!-- 顶部提示文字 -->
      <!-- #ifdef H5 || MP-BAIDU || MP-TOUTIAO -->
      <template #top>
        <!-- <NavBtn /> -->
      </template>
      <template #bottom>
        <view @click="onSend">onSend</view>
      </template>

      <!-- #endif -->

      <!-- for循环渲染聊天记录列表 -->
      <view v-for="(item, index) in messageList" :key="index" style="position: relative;">
        <!-- 如果要给聊天item添加长按的popup，请在popup标签上写style="transform: scaleY(-1);"，注意style="transform: scaleY(-1);"不要写在最外层，否则可能导致popup被其他聊天item盖住 -->
        <!-- <view class="popup" style="transform: scaleY(-1);">popUp</view> -->

        <!-- style="transform: scaleY(-1)"必须写，否则会导致列表倒置 -->
        <!-- 注意不要直接在chat-item组件标签上设置style，因为在微信小程序中是无效的，请包一层view -->
        <view style="transform: scaleY(-1);">
          <MessageItem :item="item"></MessageItem>
        </view>
      </view>
    </z-paging>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
// import request from '/http/request.js';
import MessageItem from './MessageItem.vue';
import NavBtn from './nav-btn.vue';
import { getMessageList } from '@/api/chatApi';
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
console.log('route', route?.query?.title);
const title = ref(props.title || route?.query?.title || '');

const paging = ref();
const inputBar = ref();
// v-model绑定的这个变量不要在分页请求结束中自己赋值！！！
const messageList = ref<Chat.MessageDto[]>([]);
const maxMessageId = ref<number | null>();
const isLatestPending = ref(false);
const isHistoryPending = ref(false);
const fetchLatest = async () => {
  if (isLatestPending.value) return;
  isLatestPending.value = true;
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
      isLatestPending.value = false;
    });
};

const fetchHistory = async () => {
  if (isHistoryPending.value) return;
  isHistoryPending.value = true;
  return await getMessageList({
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
      isHistoryPending.value = false;
    });
};

// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = (pageNo, pageSize) => {
  // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
  // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
  // 模拟请求服务器获取分页数据，请替换成自己的网络请求
  console.log('queryList', pageNo, pageSize);
  const params = {
    pageNo: pageNo,
    pageSize: pageSize,
  };
  getMessageList({
    sessionUnitId: props.sessionUnitId,
    maxMessageId: null,
    maxResultCount: 20,
    skipCount: 0,
  })
    .then(res => {
      console.log('fetchHistory', res);
      maxMessageId.value = res.items[0].id;
      messageList.value = messageList.value.concat(res.items);
      // scrollToBottom();
      // 将请求的结果数组传递给z-paging
      paging.value?.complete(res.items);
    })
    .catch(res => {
      // 如果请求失败写paging.value.complete(false);
      // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
      // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
      paging.value?.complete(false);
    })
    .finally(() => {
      isHistoryPending.value = false;
    });
};

// 监听键盘高度改变，请不要直接通过uni.onKeyboardHeightChange监听，否则可能导致z-paging内置的键盘高度改变监听失效（如果不需要切换表情面板则不用写）
const keyboardHeightChange = res => {
  inputBar.value.updateKeyboardHeightChange(res);
};

// 用户尝试隐藏键盘，此时如果表情面板在展示中，应当通知chatInputBar隐藏表情面板（如果不需要切换表情面板则不用写）
const hidedKeyboard = () => {
  // inputBar.value.hidedKeyboard();
};
const onRefresh = () => {
  // 刷新时，重新获取最新数据
  console.log('onRefresh');
  fetchLatest();
};
// 发送新消息
const doSend = msg => {
  uni.showLoading({
    title: '发送中...',
  });
  setTimeout(() => {
    uni.hideLoading();
    paging.value?.addChatRecordData({
      time: '',
      icon: '/static/daxiong.jpg',
      name: '大雄',
      content: msg,
      isMe: true,
    });
  }, 500);
};

const onSend = () => {
  uni.showLoading({ title: '发送中...' });
  const items = Array.from({ length: 3 }).map((_, i) => ({
    id: maxMessageId.value! + 1 + i,
    content: {
      text: `${maxMessageId.value! + 1 + i}`,
    },
  }));
  uni.hideLoading();
  // messageList.value = messageList.value.concat(items);
  maxMessageId.value = maxMessageId.value! + items.length;
  paging.value?.addChatRecordData(items);
};
</script>

<style scoped>
.header {
  padding: 20rpx;
  background-color: red;
  font-size: 20rpx;
  color: white;
}
.popup {
  position: absolute;
  top: -20px;
  z-index: 1000;
  width: 400rpx;
  height: 200rpx;
  background-color: red;
}
</style>
