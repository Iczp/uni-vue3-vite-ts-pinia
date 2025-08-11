<template>
  <z-paging
    ref="pagingRef"
    :refresher-only="true"
    @scroll="onScroll"
    @refresh="onRefresh"
    :auto="false"
  >
    <template #top>
      <AppNavBar
        title="我的"
        :isBack="false"
        :border="false"
        class="bg-white"
        backgroundColor="#ffffff"
      ></AppNavBar>
    </template>

    <CellGroup>
      <Cell class="before-none" :arrow="false">
        <template #label>
          <div class="py-12 flex flex-row gap-12">
            <Avatar :size="48" :item="chatStore.current" />
            <div class="max-w-240 flex flex-col gap-8">
              <div class="flex items-center text-ellipsis text-16 font-bold">
                <span>{{ chatStore.current?.name || '-' }}</span>
                <Gender :gender="chatStore.current?.gender" class="ml-4"></Gender>
              </div>
              <div class="text-ellipsis text-14 text-dark-50">
                账号: {{ chatStore.current?.code }}
              </div>
              <div class="text-ellipsis text-14 text-dark-100">
                地区: {{ chatStore.current?.area || '-' }}
              </div>
            </div>
          </div>
        </template>
      </Cell>
      <Cell icon="i-ic:round-edit" label="编辑" arrow></Cell>
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
      <Cell icon="i-ic:round-favorite-border" label="关注我的" arrow>
        <template #value>
          <Badge class="gray" :count="9"></Badge>
        </template>
      </Cell>
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

    <!-- <div>
      <h3>authStore:</h3>
      <scroll-view scroll>
        <pre>{{ authStore.token }}</pre>
      </scroll-view>
    </div> -->
    <template #loadingMoreNoMore>
      <view style="background-color: red;">这是完全自定义的没有更多数据view</view>
    </template>
  </z-paging>
</template>

<script lang="ts" setup>
import CellGroup from '@/pages/chat/components/CellGroup.vue';
import Cell from '@/pages/chat/components/Cell.vue';
import Badge from '@/pages/chat/components/Badge.vue';
import Avatar from '@/pages/chat/components/Avatar.vue';
import Gender from '@/pages/chat/components/Gender.vue';
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { useChatStore } from '@/store/chatStore';
import { userHeader } from '@/api/userHeader';
import { getChatObjectDetail } from '@/api/chatApi';

const chatStore = useChatStore();

const userStore = useUser();

const authStore = useAuth();

const env = ref(import.meta.env);
const pagingRef = ref();

const onRefresh = () => {
  loadData();
  console.log('刷新');
};
const login = () => {
  authStore
    .fetchToken(userHeader)
    .then(res => {
      uni.showToast({
        title: '登录成功',
        icon: 'success',
      });
    })
    .catch(err => {
      console.error(err);
      uni.showToast({
        title: `${err.data?.error || '登录失败'}${err.data?.error_description}`,
        icon: 'none',
      });
    });
};
const refreshToken = () => {
  authStore.refreshToken().then(res => {
    uni.showToast({
      title: '刷新成功',
      icon: 'success',
    });
  });
};

const opacity = ref(0);

const loadData = () => {
  if (chatStore.current?.id) {
    getChatObjectDetail({ id: chatStore.current?.id })
      .then(res => {
        pagingRef.value?.complete(true);
      })
      .catch(err => {
        pagingRef.value?.complete(false);
      });
  }
};

const onScroll = e => {
  // console.log("滚动事件", e);
  opacity.value = Math.min(e.detail.scrollTop / 400, 1);
  // console.log("滚动透明度", opacity.value);
};
onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
  loadData();
});
</script>

<style lang="scss" scoped></style>
