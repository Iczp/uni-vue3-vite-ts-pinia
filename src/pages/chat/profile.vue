<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="我的" :isBack="false" :border="false" backgroundColor="#f5f5f5">
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
      <u-cell-group>
        <u-cell-item icon="setting-fill" title="个人设置"></u-cell-item>

        <u-cell-item icon="integral-fill" title="会员等级" value="新版本"></u-cell-item>
      </u-cell-group>

      <u-cell-group>
        <u-cell-item icon="setting-fill" title="我的收藏"></u-cell-item>
      </u-cell-group>

      <!-- <div>items:{{ dataList }}</div> -->
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

      <div designMode="on">
        designMode:on

        <input placeholder="input:" placeholder-class="input-placeholder" @input="" />
      </div>

      <div>
        <h3>userStore.token</h3>
        <scroll-view scroll>
          <pre>{{ userStore.name }}</pre>
        </scroll-view>
      </div>


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
