<template>
  <z-paging
    class="bg-white"
    ref="pagingRef"
    :refresher-only="true"
    @scroll="onScroll"
    @refresh="onRefresh"
    :auto="false"
  >
    <template #top>
      <AppNavBar
        :title="''"
        class="bg-white"
        :isBack="false"
        :isMore="false"
        :border="false"
      ></AppNavBar>
    </template>

    <div class="bg-white mt-36">
      <div class="flex px-24 text-24">登录</div>
      <u-form :model="form" ref="form1" class="p-24">
        <u-form-item label="" prop="name">
          <div class="i-ic:round-account-circle text-16 text-gray-400 mr-8"></div>
          <u-input v-model="form.account" placeholder="账号" />
        </u-form-item>
        <u-form-item label="" prop="name">
          <div class="i-ic:round-lock text-16 text-gray-400 mr-8"></div>
          <u-input placeholder="密码" type="password" v-model="form.password" />
        </u-form-item>
      </u-form>
      <div class="flex flex-row justify-center py-12">
        <u-button type="primary" @click="login">登录</u-button>
      </div>
    </div>

    <Divider text="其他登录方式"></Divider>

    <div class="flex flex-row justify-center py-12 text-24 text-gray gap-24">
      <div class="i-streamline-logos:wechat-logo-solid"></div>
      <div class="i-streamline-logos:qq-logo-solid"></div>
      <div class="i-streamline-logos:github-logo-2-solid"></div>
      <div class="i-streamline-logos:google-logo-solid"></div>
      <div class="i-streamline-logos:tiktok-logo-solid"></div>
    </div>
  </z-paging>
</template>

<script lang="ts" setup>
import Divider from '@/pages/im/components/Divider.vue';
import { useAuthStore } from '@/store/auth';
import { userHeader } from '@/api/userHeader';
import { useAuthPage } from '@/hooks/useAuthPage';
import { getUserInfo } from '@/api/authApi';
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

const authStore = useAuthStore();

const pagingRef = ref();

const form = reactive({
  account: 'zhongpei',
  password: '1q2w3E*',
  code: '',
  name: '',
});

const onRefresh = () => {
  console.log('刷新');
};
const isPending = ref(false);
const login = () => {
  if (isPending.value) {
    return;
  }
  isPending.value = true;
  uni.showLoading({ title: '正在登录...', mask: true });
  authStore
    .login({
      username: form.account,
      password: form.password,
      grant_type: 'password',
    })
    .then(token => {
      authStore
        .getUserInfo()
        .then(user => {
          console.log('getUserInfo', user);
          uni.redirectTo({ url: `/pages/im/index?sub=${user.sub}` });
          uni.showToast({ title: '登录成功', icon: 'success' });
        })
        .catch(err => {
          console.error('getUserInfo error', err);
          uni.showToast({ icon: 'none', title: `获取用户信息失败:${err}` });
        });
    })
    .catch(err => {
      console.error(err);
      uni.showToast({
        title: `${errCodes[err.data?.error] || '登录失败'}:${
          errDescriptions[err.data?.error_description] || err.data?.error_description
        }`,
        icon: 'none',
      });
    })
    .finally(() => {
      isPending.value = false;
      // uni.hideLoading();
    });
};
const errCodes = {
  invalid_grant: '登录失败',
  unsupported_grant_type: '不支持的授权类型',
  invalid_client: '无效的客户端',
  invalid_request: '请求无效',
  unauthorized_client: '未授权的客户端',
  access_denied: '访问被拒绝',
  unsupported_response_type: '不支持的响应类型',
  invalid_scope: '无效的范围',
  server_error: '服务器错误',
  temporarily_unavailable: '暂时不可用',
  insufficient_scope: '范围不足',
};
const errDescriptions = {
  'Invalid username or password!': '账号或密码错误！',
  'User is not active!': '用户未激活！',
  'User is locked!': '用户被锁定！',
  'User is disabled!': '用户已禁用！',
  'User is deleted!': '用户已被删除！',
  'User is not found!': '找不到该用户！',
  'User is not verified!': '用户未验证！',
  'User is not activated!': '用户未激活！',
  'User is not logged in!': '用户未登录！',
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
