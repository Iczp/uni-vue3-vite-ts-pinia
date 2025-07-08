<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="消息" :isBack="true" :border="false" backgroundColor="#f5f5f5">
        <template #left>
          <CurrentChatObject />
        </template>
      </AppNavBar>
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
      @refresh="onRefresh"
      :default-page-size="query.maxResultCount"
    >
      <template #empty>没有数据哦</template>

      <div>items:{{ dataList }}</div>
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
          <pre>{{ userStore.name }}</pre>
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
import { getConnectionPool, getSessionUnitList } from '@/api/chatApi';
import { userHeader } from '@/api/userHeader';
import CurrentChatObject from './components/CurrentChatObject.vue';
// useBridge();
const userStore = useUser();
const authStore = useAuth();

const env = ref(import.meta.env);

const onRefresh = () => {
  uni.$emit('refresh@chat-index');
  console.log('刷新');
};
const login = () => {
  authStore.fetchToken(userHeader);
};
const refreshToken = () => {
  authStore.refreshToken();
};
const { pagingRef, dataList, queryList, isPending, query } = usePaging({
  pageSize: 20,
  service: getSessionUnitList,
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
