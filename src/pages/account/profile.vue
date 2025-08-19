<template>
  <z-paging
    class=""
    ref="pagingRef"
    :refresher-only="true"
    @scroll="onScroll"
    @onRefresh="onRefresh"
    :auto="false"
  >
    <template #top>
      <AppNavBar
        :title="'账号'"
        class="bg-white"
        :isBack="true"
        :isMore="false"
        :border="false"
      ></AppNavBar>
    </template>
    <CellGroup>
      <Cell label="账号" :value="account" :arrow="true"></Cell>
      <Cell label="邮箱" :value="email" :arrow="true"></Cell>
    </CellGroup>

    <CellGroup label="安全">
      <Cell label="登录日志" :arrow="true"></Cell>
      <Cell label="授权" :arrow="true">
        <template #value>
          <Badge class="gray" :count="3" :max="99"></Badge>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup label="设备">
      <Cell :label="`ID(${sysInfo?.deviceType})`" :value="sysInfo?.deviceId" :arrow="true"></Cell>
      <Cell label="Model" :value="sysInfo?.model" :arrow="true"></Cell>
      <Cell label="OS" :value="`${sysInfo?.osName}(${sysInfo?.osVersion})`" :arrow="true"></Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-lock-person" label="登录" help="Login" @click="login" arrow></Cell>
      <Cell
        icon="i-ic:round-token"
        label="刷新Token"
        help="RefreshToken"
        @click="refreshToken"
        format="MM-DD HH:mm:ss"
        :value="authStore.token?.creation_time"
        class=""
        arrow
      ></Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-touch-app" label="版本" help="请升级" :disabled="true" arrow>
        <template #value>
          <div class="bg-gray-100 rounded-24px px-12 py-2 text-dark-100">新版本 v1.0.1</div>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell label="退出" :arrow="true"></Cell>
    </CellGroup>
  </z-paging>
</template>

<script lang="ts" setup>
import Cell from '@/pages/im/components/Cell.vue';
import CellGroup from '@/pages/im/components/CellGroup.vue';
import Badge from '@/pages/im/components/Badge.vue';
import { useAuth } from '@/store/auth';
import { userHeader } from '@/api/userHeader';

const props = defineProps({
  id: {
    type: String,
  },
  title: {
    type: String,
    default: '用户信息',
  },
});

const title = ref('登录');

const account = ref('account');
const email = ref('1000@intry.cn');
const authStore = useAuth();

const pagingRef = ref();

const sysInfo = uni.getSystemInfoSync();

console.log('系统信息', sysInfo);

const onRefresh = () => {
  console.log('刷新');
  pagingRef.value?.complete(true);
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
