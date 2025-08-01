<template>
  <z-paging
    ref="paging"
    v-model="messageList"
    use-chat-record-mode
    safe-area-inset-bottom
    bottom-bg-color="#f8f8f8"
    @query="queryList"
    @onRefresh="onRefresh"
    @keyboardHeightChange="keyboardHeightChange"
    @hidedKeyboard="hidedKeyboard"
  >
    <template #top>
      <AppNavBar :title="title" :isBack="true" :isMore="true" :border="true">
        <div class="flex flex-1 items-center flex-col justify-center gap-2">
          <div class="text-16 flex flex-row items-center gap-4 max-w-[64%]">
            <span class="text-ellipsis">{{ title }}</span>
            <i v-if="isImmersed" class="text-14 text-gray-400 i-ic:baseline-notifications-off"></i>
          </div>
          <div
            v-if="sessionUnit?.sessionUnitCount && destination?.objectType == ObjectTypes.Room"
            class="text-10 text-sky-500"
          >
            共有 {{ sessionUnit?.sessionUnitCount }} 人
          </div>
        </div>

        <template #right>
          <div class="text-20 flex flex-row gap-8">
            <div v-if="isShopkeeperOrWaiter" class="text-20 i-ic:round-electrical-services"></div>
            <div class="text-20 i-ic:round-more-horiz" @click="onMoreClick"></div>
          </div>
        </template>
      </AppNavBar>
    </template>

    <template #empty="{ isLoadFailed }">
      <div class="text-12 text-gray-400">没有消息({{ isLoadFailed }})</div>
    </template>

    <template #loading>
      <view style="transform: scaleY(-1);">
        <div class="flex flex-center text-gray-400 w-full top-160 fixed text-12">加载中...</div>
      </view>
    </template>

    <template #loadingMoreLoading>
      <view style="transform: scaleY(-1);">
        <div class="flex flex-center text-gray-400 w-full top-360 fixed text-12">更多加载中...</div>
      </view>
    </template>
    <template #loadingMoreDefault>
      <view style="transform: scaleY(-1);">
        <div class="flex flex-center text-gray-400 w-full top-360 fixed text-12">加载更多...</div>
      </view>
    </template>

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

    <!-- <MessageViewer :sessionUnitId="id" class="flex-1"></MessageViewer> -->
    <template #bottom>
      <div>{{ pageStyle }}/{{ windowHeight }}</div>
      <ChatInput :enabled="isInputEnabled" />
    </template>
  </z-paging>
</template>

<script lang="ts" setup>
// import MessageViewer from './components/MessageViewer.vue';
import MessageItem from './components/MessageItem.vue';
import NavBtn from './components/nav-btn.vue';
import { getMessageList } from '@/api/chatApi';
import ChatInput from './components/ChatInput.vue';
import { getSessionUnitItemDetail } from '@/api/chatApi';
import { ObjectTypes } from '@/utils/enums';
import { navToSetting } from '@/utils/nav';
const props = defineProps({
  // sessionUnitId
  id: {
    type: [String],
    default: 'e52bacf4-c231-061a-6628-3a0b0cf571fb',
    // required: true,
  },
  title: {
    type: String,
  },
});

const sessionUnitId = props.id;

const title = computed(
  () =>
    destination.value?.displayName ||
    destination.value?.name ||
    decodeURIComponent(props.title || '聊天'),
);
const sessionUnit = ref<Chat.SessionUnitDto | null>(null);
const setting = computed(() => sessionUnit.value?.setting);
const destination = computed(() => sessionUnit.value?.destination);
const owner = computed(() => sessionUnit.value?.owner);
const isInputEnabled = computed(() => setting.value?.isInputEnabled || false);
const isShopkeeperOrWaiter = computed(() =>
  [ObjectTypes.ShopKeeper, ObjectTypes.ShopWaiter].includes(
    sessionUnit.value?.ownerObjectType || ObjectTypes.Anonymous,
  ),
);

const isImmersed = computed(() => sessionUnit.value?.setting?.isImmersed || false);

const windowHeight = uni.getSystemInfoSync().windowHeight;
console.log(windowHeight);
const pageStyle = reactive({
  // height: `${windowHeight}px`,
});
// uni.getStorage({
//   key: `sessionUnit-${props.id}`,
//   success: res => {
//     console.log('sessionUnitJson', res.data);
//     sessionUnit.value = JSON.parse(res.data);
//     // title.value = destination.value?.displayName || destination.value?.name || '';
//   },
//   fail: () => {
//     console.log('No session unit found in storage');
//   },
// });

const sessionUnitJson = uni.getStorageSync(`sessionUnit-${props.id}`);
if (sessionUnitJson) {
  sessionUnit.value = JSON.parse(sessionUnitJson);
  // title.value = destination.value?.displayName || destination.value?.name || '';
}

getSessionUnitItemDetail({ id: props.id })
  .then(res => {
    console.log('getSessionUnitItem', res);
    res.localTime = new Date();
    sessionUnit.value = res;
    uni.setStorageSync(`sessionUnit-${props.id}`, JSON.stringify(res));
    // title.value = destination.value?.displayName || destination.value?.name || '';
  })
  .catch(err => {
    console.error('Error fetching session unit item:', err);
  });
const onMoreClick = () => {
  console.log('onMoreClick');
  navToSetting({
    id: props.id,
    objectType: sessionUnit.value?.destination?.objectType,
    // title: '聊天设置',
    count: sessionUnit.value?.sessionUnitCount,
  });
};

onMounted(() => {
  console.log('mounted');
  window.visualViewport?.addEventListener('resize', () => {
    // pageStyle.height = `${window?.visualViewport?.height}px`;
  });
});

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
    sessionUnitId: props.id,
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
    sessionUnitId: sessionUnitId,
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
    sessionUnitId: sessionUnitId,
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
<style>
html {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.session-page {
  display: flex;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  // width: 100%;
  // height: calc(506px - var(--window-top));
  // height: 100vh;
}
.nav-bar {
  flex-shrink: 0;
  padding-top: 44px;
  height: 44px;
  background: #eee;
}
</style>
