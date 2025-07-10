<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="" :isBack="true" :border="false" backgroundColor="#f5f5f5">
        <template #left>
          <CurrentChatObject />
        </template>
      </AppNavBar>
      <view class="h-48 px-12 flex items-center justify-between">
        <u-search
          :placeholder="`搜索(${dataList.length}/${totalCount}) max:${maxLastMessageId}, min:${minLastMessageId}`"
          :focus="false"
          :animation="false"
          @search="onSearch"
          @custom="onSearch"
          v-model="query.keyword"
        ></u-search>
      </view>
    </view>

    <z-paging
      ref="pagingRef"
      class="z-paging mt-48"
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
      <template #empty>
        <div class="text-12 text-gray-400">没有消息</div>
      </template>

      <template #loading>
        <SessionUnitSkeleton :count="11" />
        <div class="flex flex-center text-gray-400 w-full top-360 fixed text-12">加载中...</div>
      </template>

      <template #backToTop>
        <div class="flex flex-center bg-gray-300 bg-opacity-50 w-36 h-36 rounded-[50%]">
          <i class="text-14 text-gray-6 i-ic:sharp-vertical-align-top"></i>
        </div>
      </template>

      <template #loadingMoreLoading>
        <SessionUnitSkeleton :count="1" />
      </template>

      <template #loadingMoreNoMore>
        <view class="flex flex-center h-48 text-12 text-gray-500">
          共有
          <span class="font-bold mx-2">{{ dataList.length }}</span>
          好友
        </view>
      </template>

      <!--  -->

      <template #cell="{ item, index }">
        <SessionUnit :item="item" :index="index" @click="onSessionUnitClick(item, index)" />
      </template>
    </z-paging>
  </div>
</template>

<script lang="ts" setup>
import { usePaging } from '@/hooks/usePaging';
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { getSessionUnitList } from '@/api/chatApi';
import CurrentChatObject from './components/CurrentChatObject.vue';
import SessionUnit from './components/SessionUnit.vue';
import SessionUnitSkeleton from './components/SessionUnitSkeleton.vue';
import { useChatObjectStore } from '@/store/chatObjectStore';

const userStore = useUser();
const authStore = useAuth();
const chatStore = useChatObjectStore();

const onRefresh = () => {
  uni.$emit('refresh@chat-index');
  console.log('刷新');
};

const setMaxMessageId = (id: number | null, force: boolean = false) => {
  if (force || Number(id) > (maxLastMessageId.value || 0)) {
    maxLastMessageId.value = id;
    console.log('setMaxMessageId', id);
  }
};
const setMinMessageId = (id: number | null, force: boolean = false) => {
  if (force || Number(id) < (minLastMessageId.value || Infinity)) {
    minLastMessageId.value = id;
    console.log('setMinMessageId', id);
  }
};

const {
  pagingRef,
  dataList,
  queryList: queryList,
  isPending,
  isEof,
  query,
  reload,
  totalCount,
} = usePaging<ChatApi.SessionUnitDto>({
  input: {
    ownerId: 13,
    maxResultCount: 20,
    keyword: '',
    minMessageId: null,
    maxMessageId: 7277454,
  },
  service: getSessionUnitList,
  format: (res, input) => {
    if (input?.skipCount == 0) {
      const lastMessageId = getMaxLastMessageId(res.items);
      setMaxMessageId(lastMessageId);
    }
    return res;
  },
});
// 获取 dataList 数组中 lastMessageId 的最大值
const getMaxLastMessageId = (list: ChatApi.SessionUnitDto[]) => {
  if (list.length === 0) return null; // 如果数组为空，则返回 null
  return list.reduce((max, item) => {
    return Math.max(max, item.lastMessageId || 0); // 确保 item.lastMessageId 存在，如果不存在则默认为 0
  }, 0);
};

// 获取 dataList 数组中 lastMessageId 的最小值
const getMinLastMessageId = (list: ChatApi.SessionUnitDto[]) => {
  if (list.length === 0) return null; // 如果数组为空，则返回 null
  return list.reduce((min, item) => {
    return Math.min(min, item.lastMessageId || Infinity); // 确保 item.lastMessageId 存在，如果不存在则默认为 Infinity
  }, Infinity);
};

const minLastMessageId = ref<number | null>();
const maxLastMessageId = ref<number | null>();

const updateDatalist = (list: ChatApi.SessionUnitDto[]) => {
  list.forEach((newItem, index) => {
    newItem.badge = newItem.lastMessageId;
    const existingItem = dataList.value.find(item => item.id === newItem.id);
    if (existingItem) {
      // 如果 ID 存在，则更新项目
      Object.assign(existingItem, newItem); // 使用 Object.assign 来合并对象属性，只更新不同的属性
    } else {
      // 如果 ID 不存在，则新增项目
      dataList.value.push(newItem);
    }
  });
  // 按 sorting 和 lastMessageId 降序排序
  dataList.value.sort((a, b) => {
    if (a.sorting !== b.sorting) {
      return b.sorting - a.sorting; // 首先按 sorting 降序排序
    } else {
      return b.lastMessageId - a.lastMessageId; // 如果 sorting 相同，则按 lastMessageId 降序排序
    }
  });
  pagingRef.value?.completeByKey(dataList.value, 'id');
};

const fetchLatest = () => {
  const q = {
    minMessageId: Number(maxLastMessageId.value), // + 1,
    maxMessageId: null,
    keyword: '',
    ownerId: query.value.ownerId,
    skipCount: 0,
    maxResultCount: query.value.maxResultCount,
  };
  getSessionUnitList(q).then(res => {
    updateDatalist(res.items);
    console.log('fetchLatest', q, res);
  });
};
// const totalCount = ref(0);

const _queryList = (pageNo: number, pageSize: number) => {
  console.log('queryList', pageNo, pageSize);

  if (pageNo == 1) {
    minLastMessageId.value = null;
  }
  query.value.maxMessageId = minLastMessageId.value;
  query.value.maxResultCount = pageSize;
  isPending.value = true;
  getSessionUnitList(query.value)
    .then(res => {
      if (pageNo == 1) {
        totalCount.value = res.totalCount;
      }
      setMaxMessageId(res.items[0]?.lastMessageId);
      setMinMessageId(res.items[res.items.length - 1]?.lastMessageId);
      pagingRef.value?.complete(res.items);
      isEof.value = res.items.length < pageSize;
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      pagingRef.value?.complete(false);
    })
    .finally(() => {
      isPending.value = false;
    });
};

watch(
  () => chatStore.current,
  v => {
    console.log('#watch current', v);
    if (v) {
      query.value.ownerId = 13; //v.id;
    }
  },
  { immediate: true },
);

const onSessionUnitClick = (item: any, index: number) => {
  dataList.value[index].badge = '123';
  fetchLatest();
  // pagingRef.value?.reload(true);
};

const onSearch = () => {
  console.log('搜索关键字:', query.value.keyword);
};

onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
});
</script>

<style lang="scss" scoped></style>
