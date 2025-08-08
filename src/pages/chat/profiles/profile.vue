<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar :isBack="true" :border="false" backgroundColor="#f5f5f5">
        <!-- <template #left>
          <CurrentChatObject />
        </template> -->
      </AppNavBar>
    </view>

    <z-paging
      ref="pagingRef"
      class="z-paging"
      :refresher-only="true"
      @scroll="onScroll"
      @refresh="onRefresh"
      :auto="false"
    >
      <template #loadingMoreNoMore>
        <view style="background-color: red;">这是完全自定义的没有更多数据view</view>
      </template>
    </z-paging>
  </div>
</template>

<script lang="ts" setup>
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { userHeader } from '@/api/userHeader';

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
