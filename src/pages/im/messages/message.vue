<template>
  <div class="page">
    <z-paging
      ref="pagingRef"
      :use-virtual-list="true"
      v-model="dataList"
      data-key="id"
      :autoShowBackToTop="true"
      back-to-top-bottom="24rpx"
      @query="queryList"
      @onRefresh="onRefresh"
      :auto="true"
      :default-page-size="query.maxResultCount!"
    >
      <template #top>
        <AppNavBar title="" :isBack="true" :border="true" v-double-tap="scrollToBadge">
          <template #left>
            <CurrentChatObject v-if="authStore.isLogin" />
          </template>
        </AppNavBar>
        <Tabs :tabs="tabs" :current="tabIndex" class="border-after" />
        <ConnectStatus />
      </template>
      <!-- <template #bottom>
        <div class="flex flex-center h-48 text-12 text-gray-500">
          共有
          <span class="font-bold mx-2">{{ dataList.length }}</span>
          好友
        </div>
      </template> -->

      <template #backToTop>
        <div class="flex flex-center bg-gray-300 bg-opacity-50 w-36 h-36 rounded-[50%]">
          <i class="text-14 text-gray-6 i-ic:sharp-vertical-align-top"></i>
        </div>
      </template>

      <template #empty="{ isLoadFailed }">
        <div class="text-12 text-gray-400">没有好友</div>
      </template>

      <template #loading>
        <SessionUnitSkeleton :count="fullScreenCount" />
        <div class="flex flex-center text-gray-400 w-full top-360 fixed text-12">加载中...</div>
      </template>

      <template #loadingMoreLoading>
        <SessionUnitSkeleton :count="3" text="加载中..." />
      </template>
      <template #loadingMoreDefault>
        <SessionUnitSkeleton :count="3" @click="loadingMoreClick" text="加载更多..." />
      </template>

      <template #loadingMoreNoMore>
        <!-- absolute bottom-0 w-full -->
        <view class="flex flex-center h-64 text-12 text-gray-500">
          共有
          <span class="font-bold mx-2">{{ dataList.length }}</span>
          会话
        </view>
      </template>

      <!--  -->
      <template #cell="{ item, index }">
        <SessionUnit
          :item="item"
          :id="`su-${item.id}`"
          :index="index"
          @click="onSessionUnitClick(item, index)"
        />
      </template>
    </z-paging>

    <!-- 弹出层 -->
    <u-popup v-model="isPopVisible" mode="bottom" :mask="true" :maskClosable="true">
      <view class="h-120px flex justify-center items-center bg-white">
        <scroll-view scroll-x="true" class="popup-scroll-view">
          <view class="popup-content">
            <view class="popup-text">出淤泥而不染，濯清涟而不妖</view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </div>
</template>

<script lang="ts" setup>
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { usePaging } from '@/hooks/usePaging';
import { useSignalR } from '@/hooks/useSignalR';
import { useAuthStore } from '@/store/auth';
import { getSessionUnitList } from '@/api/chatApi';

import { useChatStore } from '@/store/chatStore';
import { navToChat } from '@/utils/nav';
import { jsonParse } from '@/utils/object';

import CurrentChatObject from '@/pages/im/components/CurrentChatObject.vue';
import SessionUnit from '@/pages/im/components/SessionUnit.vue';
import ConnectStatus from '@/pages/im/components/ConnectStatus.vue';
import SessionUnitSkeleton from '@/pages/im/components/SessionUnitSkeleton.vue';
import Tabs from '@/pages/im/components/Tabs.vue';
import { notify } from '@/utils/notify';

const authStore = useAuthStore();
const chatStore = useChatStore();
const isPopVisible = ref(false);

const tabIndex = ref(0);
const tabs = ref([
  {
    name: '全部',
    code: 'all',
    badge: 0,
  },
  {
    name: '未读',
    code: 'unread',
    badge: 5,
  },
  {
    name: '关注',
    code: 'attention',
    badge: 5,
  },
  {
    name: '@我',
    code: 'at',
    badge: 5,
  },
  {
    name: '群聊',
    code: 'group',
    badge: 3,
  },
  // {
  //   name: '公众号',
  //   badge: 0,
  //   dot: false,
  // },
  // {
  //   name: '订阅号',
  //   badge: 0,
  //   dot: false,
  // },
  {
    name: '广场',
    badge: 6,
    dot: false,
  },
]);

const setMaxTicks = (id: number | null | undefined, force: boolean = false) => {
  if (force || Number(id) > (maxTicks.value || 0)) {
    maxTicks.value = id;
    console.log('setMaxTicks', id);
  }
};

const setMinTicks = (id: number | null | undefined, force: boolean = false) => {
  if (force || Number(id) < (minTicks.value || Infinity)) {
    minTicks.value = id;
    console.log('setMinTicks', id);
  }
};
const sysInfo = uni.getSystemInfoSync();
const fullScreenCount = computed(() => {
  const height = sysInfo.windowHeight - 96 - 60;

  const count = Math.floor(height / 64);
  console.log('height', height, count);
  return count;
});

const {
  pagingRef,
  dataList,
  queryList: ___queryList,
  isPending,
  isEof,
  query,
  reload,
  totalCount,
} = usePaging<Chat.SessionUnitDto>({
  input: {
    ownerId: null,
    maxResultCount: Math.max(Math.min(Math.floor(fullScreenCount.value * 2), 100), 16),
    keyword: '',
    // minMessageId: null,
    // maxMessageId: 7277454,
    // maxTicks: 638789301637991000,
    sorting: 'sorting desc,ticks desc',
  },
  service: getSessionUnitList,
  format: (res, input) => {
    if (input?.skipCount == 0) {
      const ticks = getMaxTicks(res.items);
      setMaxTicks(ticks);
    }
    return res;
  },
});
// 获取 dataList 数组中 ticks 的最大值
const getMaxTicks = (list: Chat.SessionUnitDto[]): number | null => {
  if (list?.length === 0) return null; // 如果数组为空，则返回 null
  return list?.reduce((max, item) => {
    return Math.max(max, item.ticks || 0); // 确保 item.ticks 存在，如果不存在则默认为 0
  }, 0);
};

// 获取 dataList 数组中 ticks 的最小值
const getMinTicks = (list: Chat.SessionUnitDto[]): number | null => {
  if (list.length === 0) return null; // 如果数组为空，则返回 null
  return list.reduce((min, item) => {
    return Math.min(min, item.ticks || Infinity); // 确保 item.ticks 存在，如果不存在则默认为 Infinity
  }, Infinity);
};

const minTicks = ref<number | null>();
const maxTicks = ref<number | null>();

const updateDatalist = (list: Chat.SessionUnitDto[]) => {
  console.log('updateDatalist', list);
  list.forEach((newItem, index) => {
    // newItem.badge = newItem.ticks;
    const existingItem = dataList.value.find(item => item.id === newItem.id);
    if (existingItem) {
      // 如果 ID 存在，则更新项目
      Object.assign(existingItem, newItem); // 使用 Object.assign 来合并对象属性，只更新不同的属性
    } else {
      // 如果 ID 不存在，则新增项目
      dataList.value.push(newItem);
    }
  });
  // 按 sorting 和 ticks 降序排序
  dataList.value.sort((a, b) => {
    if (a.sorting !== b.sorting) {
      return (b.sorting || 0) - (a.sorting || 0); // 首先按 sorting 降序排序
    } else {
      return (b.ticks || 0) - (a.ticks || 0); // 如果 sorting 相同，则按 ticks 降序排序
    }
  });
  dataList.value = [...dataList.value];
  // pagingRef.value?.refresh();
  // pagingRef.value?.resetTotalData ();
};

const loadStorage = (ownerId: number) => {
  const messageListJson = uni.getStorageSync(`message-list-${ownerId}`);
  if (messageListJson) {
    const messageList = jsonParse(messageListJson);
    console.log('messageList', messageList);
    if (Array.isArray(messageList) && messageList.length > 0) {
      updateDatalist(messageList);
      setMaxTicks(getMaxTicks(messageList));
      setMinTicks(getMinTicks(messageList));
    }
  }
};
const isFetchLatest = ref(false);
const fetchLatest = async (caller?: string) => {
  try {
    console.log('fetchLatest caller:', caller);

    if (!query.value.ownerId) {
      console.warn('fetchLatest 没有 ownerId');
      uni.showToast({ title: '没有 ownerId', icon: 'none' });
      throw new Error('[fetchLatest]没有 ownerId');
      return;
    }

    if (isFetchLatest.value) {
      console.warn('fetchLatest 已经在加载中...');
      return;
    }
    isFetchLatest.value = true;
    const q = {
      minTicks: maxTicks.value ? Math.floor(maxTicks.value) + 100 : null,
      // minTicks: 638894630088401300,
      maxTicks: null,
      keyword: '',
      ownerId: query.value.ownerId,
      skipCount: 0,
      // maxResultCount: 1,
      // maxResultCount: 1,
      maxResultCount: query.value.maxResultCount,
      sorting: 'sorting desc,ticks desc',
    };
    console.warn('fetchLatest', JSON.stringify(q));
    const res = await getSessionUnitList(q);
    isFetchLatest.value = false;
    // console.log('fetchLatest', JSON.stringify(res));
    if (res.items.length > 0) {
      // res.items[0].badge = '8';
      updateDatalist(res.items);
      setMaxTicks(getMaxTicks(res.items));
      setMinTicks(getMinTicks(res.items));
      storageMessage(
        q.ownerId,
        dataList.value.slice(0, Math.min(q.maxResultCount!, dataList.value.length)),
      );
      // uni.showToast({ title: `成功加载 ${res.items.length} 条消息`, icon: 'none' });
      // return;
    } else {
      console.warn('没有新消息');
      // uni.showToast({ title: '没有新消息', icon: 'none' });
    }
  } catch (err) {
    console.error('Error fetchLatest:', err);
    isFetchLatest.value = false;
  }
};

const storageMessage = (ownerId: number, items: any[] = []) => {
  uni.setStorage({
    key: `message-list-${ownerId}`,
    data: JSON.stringify(items),
  });
};
// const totalCount = ref(0);
const fetchHistory = async () => {
  try {
    if (!query.value.ownerId) {
      console.warn('fetchHistory 没有 ownerId');
      uni.showToast({ title: '没有 ownerId', icon: 'none' });
      throw new Error('[fetchHistory]没有 ownerId');
      return;
    }
    if (isPending.value) {
      console.warn('fetchHistory 已经在加载中...');
      return;
    }
    query.value.maxTicks = minTicks.value;
    isPending.value = true;
    console.warn('fetchHistory', query.value);
    const res = await getSessionUnitList(query.value);
    if (query.value.maxTicks == null) {
      totalCount.value = res.totalCount;
      storageMessage(query.value.ownerId, res.items);
    }
    setMaxTicks(getMaxTicks(res.items));
    setMinTicks(getMinTicks(res.items));
    isEof.value = res.items.length < query.value.maxResultCount!;
    pagingRef.value?.complete(res.items);
  } catch (err) {
    console.error('Error fetching data:', err);
    pagingRef.value?.complete(false);
  } finally {
    isPending.value = false;
  }
};

// fetchLatest();
const queryList = async (pageNo: number, pageSize: number) => {
  console.log('queryList', pageNo, pageSize, toRaw(query.value));
  // 下拉刷新时
  if (pageNo == 1) {
    loadStorage(query.value.ownerId);
  }
  if (pageNo == 1 && dataList.value.length > 0) {
    // await fetchLatest();
    pagingRef.value?.complete(dataList.value);
    console.warn('-----', dataList.value.length);
  } else {
    await fetchHistory();
  }
};
// const idList = [13, 14, 5862, 5866, 5869, 5885];
watch(
  () => chatStore.current?.id,
  v => {
    console.log('#watch current', v);
    if (!v || !authStore.isLogin) {
      return;
    }
    query.value.ownerId = chatStore.current?.id; //idList[v];
    maxTicks.value = null;
    minTicks.value = null;
    query.value.keyword = '';
    query.value.skipCount = 0;
    dataList.value = [];
    pagingRef.value?.reload();
    fetchLatest();
  },
  { immediate: true },
);

const loadingMoreClick = () => {
  console.log('loadingMoreClick');
  pagingRef.value?.doLoadMore('click');
};
const onSessionUnitClick = (item: Chat.SessionUnitDto, index: number) => {
  console.log('onSessionUnitClick', item, index);
  // notify({
  //   title: '新消息',
  //   body: item.lastMessage?.content || '',
  // });
  // return;
  navToChat({
    id: item.id,
    title: item?.destination?.displayName || item?.destination?.name,
  });
  // pagingRef.value?.reload(true);
};

const onCurrentChatObjectClick = () => {
  console.log('onCurrentChatObjectClick');
  isPopVisible.value = true;
};
const onSearch = () => {
  console.log('搜索关键字:', query.value.keyword);
};
const store = useChatStore();

const currentScrollIndex = ref(-1);
const scrollToBadge = () => {
  console.log('scrollToBadge');
  const index = dataList.value.findIndex(
    (x, i) => i > currentScrollIndex.value && Number(x.publicBadge) + Number(x.privateBadge) > 0,
  );
  currentScrollIndex.value = index;
  if (index < 0) {
    // uni.showToast({ title: '滚动到项部', icon: 'none' });
    pagingRef.value?.scrollToTop(true);
    return;
  }
  const item = dataList.value[index];
  const viewId = item ? `su-${item?.id}` : '';
  console.log('item viewId', viewId, item);
  // uni.showToast({ title: `滚动到:${index}`, icon: 'none' });
  pagingRef.value?.scrollIntoViewById(viewId, 0, true);
};

const onRefresh = async () => {
  await fetchLatest();
  console.log('刷新');
  setTimeout(() => {
    store
      .getChatObjects()
      .then(res => {
        console.log('getChatObjects:', res);
      })
      .catch(err => {
        console.error('Error fetching chat objects:', err);
      });
    store
      .getBadges()
      .then(res => {
        console.log('getBadges:', res);
      })
      .catch(err => {
        console.error('Error fetching badges:', err);
      });
  }, 100);
  // pagingRef.value?.reload(true);
};

const { onReceived, onConnected } = useSignalR();

onReceived(e => {
  console.log(e?.event, e);
  // uni.showToast({ title: `新消息${e?.command}`, icon: 'none' });
  const scope = e?.scopes?.find(x => x.chatObjectId == chatStore.current?.id);
  if (!scope) {
    return;
  }
  if (e?.command == 'UpdateBadge') {
    fetchLatest();
    return;
  }
  if (e?.command == 'Created') {
    const item = dataList.value.find(x => x.id == scope.sessionUnitId);
    if (item) {
      item.publicBadge = Number(item.publicBadge || 0) + 1;
      // item.publicBadge = 1;
      if (e?.payload.message) {
        item.lastMessage = { ...item.lastMessage, ...e?.payload.message };
      }
      notify({
        title: '新消息',
        body: item.lastMessage?.content || '',
      });
    }
    return;
  }
});

onConnected(e => {
  console.log('signalR connected', e);
  fetchLatest();
  uni.showToast({ title: 'SignalR连接成功', icon: 'none' });
});

onLoad(() => {
  console.log('h5:onLoad');
  // uni.showToast({ title: `欢迎使用${authStore.isLogin}`, icon: 'none' });
  if (authStore.isLogin && chatStore.current?.id) {
    // onRefresh();
    fetchLatest('onLoad');
  }
});

onUnload(() => {
  console.log('h5:onUnload');
});

defineExpose({
  scrollToBadge,
  currentScrollIndex,
});
</script>

<style lang="scss" scoped></style>
