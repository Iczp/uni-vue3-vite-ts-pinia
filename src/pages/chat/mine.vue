<template>
  <z-paging
    ref="pagingRef"
    :refresher-only="true"
    @scroll="onScroll"
    @refresh="onRefresh"
    :auto="false"
  >
    <template #top>
      <AppNavBar title="我的" :isBack="false" :border="false"></AppNavBar>
    </template>

    <CellGroup>
      <Cell>
        <template #label>
          <div class="py-12 flex flex-row gap-12 items-center">
            <Avatar :size="44" :item="chatStore.current" />
            <div class="max-w-120 flex flex-col gap-4">
              <div class="text-ellipsis text-16">
                {{ chatStore.current?.name || '未登录' }}
              </div>
              <div class="text-ellipsis text-12 text-gray">{{ chatStore.current?.code }}</div>
            </div>
          </div>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-recycling" label="好友圈" arrow>
        <template #value>
          <Badge class="gray" :count="10" :max="99"></Badge>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-star" label="收藏夹" arrow>
        <template #value>
          <Badge class="gray" :count="10" :max="99"></Badge>
        </template>
      </Cell>
      <Cell icon="i-ic:round-favorite" label="特别关注" arrow>
        <template #value>
          <Badge class="gray" :count="12" :max="99"></Badge>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-settings" label="设置" arrow></Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-touch-app" label="版本" arrow>
        <template #value>
          <div class="bg-gray-100 rounded-24px px-12 py-2 text-dark-100">新版本 v1.0.1</div>
        </template>
      </Cell>
    </CellGroup>
    <CellGroup>
      <Cell icon="i-ic:round-lock-person" label="Login" @click="login" arrow></Cell>
      <Cell icon="i-ic:round-token" label="RefreshToken" @click="refreshToken" arrow></Cell>
    </CellGroup>

    <div>
      <h3>authStore:</h3>
      <scroll-view scroll>
        <pre>{{ authStore.token }}</pre>
      </scroll-view>
    </div>
    <template #loadingMoreNoMore>
      <view style="background-color: red;">这是完全自定义的没有更多数据view</view>
    </template>
  </z-paging>
</template>

<script lang="ts" setup>
import CellGroup from './components/CellGroup.vue';
import Cell from './components/Cell.vue';
import Badge from './components/Badge.vue';
import Avatar from './components/Avatar.vue';

import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { useChatStore } from '@/store/chatStore';
import { userHeader } from '@/api/userHeader';

const chatStore = useChatStore();

const userStore = useUser();

const authStore = useAuth();

const env = ref(import.meta.env);
const pagingRef = ref();

const onRefresh = () => {
  uni.$emit('refresh@chat-index');
  pagingRef.value?.complete(true);
  console.log('刷新');
};
const login = () => {
  authStore.fetchToken(userHeader);
};
const refreshToken = () => {
  authStore.refreshToken();
};

const opacity = ref(0);

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
