<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="消息" :isBack="false" :border="false" backgroundColor="#f5f5f5" />
      <view class="h-48 px-12 flex items-center justify-between">
        <u-search
          placeholder="搜索"
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
      v-model="dataList"
      @query="queryList"
      @scroll="onScroll"
      :default-page-size="query.maxResultCount"
    >
      <template #empty>没有数据哦</template>

      <div>env:{{ env }}</div>
      <div>
        <h3>erpUserInfo:</h3>
        <scroll-view scroll>
          <pre>{{ userStore.name }}</pre>
        </scroll-view>
      </div>

      <button hover-class="button-hover" @click="login">Login</button>
      <button hover-class="button-hover" @click="refreshToken">refreshToken</button>
      <div>
        <h3>authStore:</h3>
        <scroll-view scroll>
          <pre>{{ authStore.token }}</pre>
        </scroll-view>
      </div>

      <div>
        <h3>userStore.token</h3>
        <scroll-view scroll>
          <pre>{{ userStore.token }}</pre>
        </scroll-view>
      </div>

      <template #cell="{ item, index }">
        <view class="item-title">{{ item.title }}</view>
      </template>

      <template #loadingMoreNoMore>
        <view style="background-color: red;">这是完全自定义的没有更多数据view</view>
      </template>
    </z-paging>
  </div>
</template>

<script lang="ts" setup>
import { usePaging } from '@/hooks/usePaging';
import TabBar from './components/tab-bar.vue';
// import { useBridge } from '@/hooks/bridge';
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
// useBridge();
const userStore = useUser();
const authStore = useAuth();

const env = ref(import.meta.env);
const erpHeader = {
  client_id: 'IM_App',
  client_secret: '1q2w3e*',
  grant_type: 'erp-token',
  scope: 'IM offline_access roles profile phone email address',
  'x-user-id': 'dd3803b8-4b20-4ed6-b58c-49a3e499380c',
  FaceToken: '',
  Authorization:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJkZDM4MDNiOC00YjIwLTRlZDYtYjU4Yy00OWEzZTQ5OTM4MGMiLCJleHAgIjoiMzMyNzY5MDc4NTE4MDc3ODY0IiwiYXBwSWQiOiJfX1VOSV9fRUE5MDY5OCIsInV1aWQiOiI0OUQ2REMzMTcyRDgyNzEyNUFGODVDRkY1OTQxNUI0RSIsImNsaWVudElkIjoiaW9zIn0.zw3b15ZgWgAowf6wu5_tmYlkvB2wXsxMpIuHyeai_Cw',
  Intranet: true,
  Mode: '0',
  ClientId: 'ios',
  AppId: '__UNI__EA90698',
  Version: '1.6.97',
  Uuid: '49D6DC3172D827125AF85CFF59415B4E',
};

const login = () => {
  authStore.fetchToken(erpHeader);
};
const refreshToken = () => {
  authStore.refreshToken();
};
const { pagingRef, dataList, queryList, isPending, query } = usePaging({
  pageSize: 20,
  service: queryInput => {
    // 模拟分页请求
    return new Promise(resolve => {
      setTimeout(() => {
        const items = Array.from({ length: Number(queryInput.maxResultCount || 20) }, (_, i) => ({
          id: (queryInput.skipCount || 0) + i + 1,
          title: `Item ${(queryInput.skipCount || 0) + i + 1}`,
        }));
        resolve({
          items,
          totalCount: 100, // 假设总条数为100
        });
      }, 300);
    });
  },
});

const onSearch = () => {
  console.log('搜索关键字:', query.value.keyword);
};

const opacity = ref(0);

const style = computed(() => ({
  '--app-heder-background-color': `rgba(0, 255, 255, ${opacity.value})`,
}));
const backgroundColor = `rgba(1, 0, 255, ${opacity.value})`;

const onScroll = e => {
  // console.log("滚动事件", e);
  opacity.value = Math.min(e.detail.scrollTop / 400, 1);
  // console.log("滚动透明度", opacity.value);
};

onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
});
</script>

<style lang="scss" scoped></style>
