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
      <Cell label="名称" :value="name" :arrow="true"></Cell>
      <Cell label="邮箱" :value="email" :arrow="true"></Cell>
      <Cell label="手机" :value="phone_number" :arrow="true"></Cell>
    </CellGroup>

    <CellGroup label="角色">
      <Cell v-for="role in roles" :label="role" :arrow="true"></Cell>
    </CellGroup>

    <CellGroup label="缓存">
      <Cell
        :label="`缓存(${storageInfo.keys.length})`"
        :value="prettyBytes(storageInfo.currentSize)"
        :arrow="true"
        @click="clearStorage"
      ></Cell>
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
      <Cell
        icon="i-ic:round-lock-person"
        label="登录"
        help="Login"
        :disabled="isLoginPending"
        @click="login"
        arrow
      ></Cell>
      <Cell
        icon="i-ic:round-token"
        label="刷新Token"
        help="RefreshToken"
        @click="refreshToken"
        format="MM-DD HH:mm:ss"
        :value="authStore.token?.creation_time"
        class=""
        :disabled="isRefreshTokening"
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
      <Cell label="退出" :arrow="true" @click="onLogout"></Cell>
    </CellGroup>
  </z-paging>
</template>

<script lang="ts" setup>
import Cell from '@/pages/im/components/Cell.vue';
import CellGroup from '@/pages/im/components/CellGroup.vue';
import Badge from '@/pages/im/components/Badge.vue';
import { useAuthStore } from '@/store/auth';
import { userHeader } from '@/api/userHeader';
import { useAuthPage } from '@/hooks/useAuthPage';
import prettyBytes from 'pretty-bytes';
import { useStorageInfo } from '@/hooks/useStorageInfo';
useAuthPage();

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
const user = computed(() => authStore.user);

const roles = computed(() => authStore.user?.role || []);
const account = computed(() => `${authStore.user?.preferred_username || ''}`.trim());

const name = computed(() =>
  `${authStore.user?.family_name || ''} ${authStore.user?.given_name || ''}`.trim(),
);
const email = computed(() => authStore.user?.email);
const phone_number = computed(() => authStore.user?.phone_number || '未设置');

const phone_number_verified = computed(() => authStore.user?.phone_number_verified);
const authStore = useAuthStore();

const pagingRef = ref();

const sysInfo = uni.getSystemInfoSync();

const { storageInfo, clearStorage } = useStorageInfo();

console.log('系统信息', sysInfo);

const onRefresh = () => {
  console.log('刷新');
  authStore.getUserInfo({ force: true }).finally(() => {
    pagingRef.value?.complete(true);
  });
};
const isLoginPending = ref(false);
const login = () => {
  if (isLoginPending.value) return;
  isLoginPending.value = true;
  authStore
    .loginErp(userHeader)
    .then(res => {
      uni.showToast({
        title: '登录成功',
        icon: 'success',
      });
    })
    .catch(err => {
      console.error(err);
      uni.showToast({
        title: `${err.data?.error || '登录失败'}:${err.data?.error_description}`,
        icon: 'none',
      });
    })
    .finally(() => {
      isLoginPending.value = false;
    });
};
const isRefreshTokening = ref(false);
const refreshToken = () => {
  if (isRefreshTokening.value) return;
  isRefreshTokening.value = true;
  authStore
    .refreshToken()
    .then(res => {
      uni.showToast({
        title: '刷新成功',
        icon: 'success',
      });
    })
    .finally(() => {
      isRefreshTokening.value = false;
    });
};

const opacity = ref(0);

const onLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出吗？',
    success: function (res) {
      if (res.confirm) {
        authStore.logout();
        uni.reLaunch({ url: '/pages/index/index' });
      } else if (res.cancel) {
        console.log('用户点击取消');
      }
    },
    fail: function (res) {
      console.log('接口调用失败的回调函数', res);
    },
  });
};
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
