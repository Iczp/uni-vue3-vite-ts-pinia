<template>
  <z-paging
    class="bg-white"
    ref="pagingRef"
    :refresher-only="false"
    :refresher-enabled="false"
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

    <div v-if="isHtml5Plus" class="flex flex-col items-center text-gray-400 gap-12">
      <div class="text-24 text-gray-200">ERP 登录</div>
      <div class="flex flex-col items-center gap-12 h-320 pt-96">
        <div><u-avatar :size="144" :src="erpUser.avatar"></u-avatar></div>
        <div class="font-bold text-16">{{ erpUser.name }}({{ erpUser.positionName }})</div>
      </div>

      <div class="flex flex-row gap-12 px-24 w-full box-border">
        <u-button
          class="flex flex-1"
          type="primary"
          :disabled="isErpLoginPending"
          @click="loginByErp"
        >
          {{ isErpLoginPending ? '登录中...' : '登录' }}
        </u-button>
      </div>
    </div>

    <div v-else class="flex flex-col">
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
    </div>
  </z-paging>
</template>

<script lang="ts" setup>
import { getAuth } from '@/commons/bridge';
import { jsBridgeReady } from '@/commons/bridge/ready';
import Divider from '@/pages/im/components/Divider.vue';
import { useAuthStore } from '@/store/auth';
import { navTo } from '@/utils/nav';
import { isHtml5Plus } from '@/utils/platform';
import { parseUrl } from '@/utils/shared';

const props = defineProps({
  to: {
    type: String,
  },
  title: {
    type: String,
    default: '用户信息',
  },
});

const title = ref('登录');

const to = decodeURIComponent(decodeURIComponent(props.to || ''));
console.warn('to', to);
const toUri = parseUrl(to);
console.warn('toUri', toUri);
// uni.showToast({ title: `uri:${JSON.stringify(toUri)}`, icon: 'none', duration: 5000 });

const authStore = useAuthStore();

const pagingRef = ref();

const form = reactive({
  account: 'admin',
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
    .then(user => {
      uni.hideLoading();
      handleLoginSuccess(user);
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
  'The specified client credentials are invalid.': '无效凭据！',
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

const appAuthInfo = ref({ header: null, user: null });

const erpUser = ref<{
  name: string;
  avatar?: string;
  positionName?: string;
  [key: string]: any;
}>({
  name: '',
  headImage: '/static/logo.png',
  positionName: '',
});

const handleLoginSuccess = (user: any) => {
  console.log('login success', user);
  navTo({
    url: toUri?.path || '/pages/im/index',
    query: {
      ...toUri.query,
      sub: user.sub,
    },
    //不使用webview打开
    webview: false,
    redirect: true,
  });
  uni.showToast({ title: '登录成功', icon: 'success' });
};

const isErpLoginPending = ref(false);
const loginByErp = () => {
  isErpLoginPending.value = true;
  uni.showLoading({ title: '正在登录...', mask: true });
  const loginParam = appAuthInfo.value?.header;
  authStore
    .loginErp(loginParam)
    .then(user => {
      uni.hideLoading();
      handleLoginSuccess(user);
    })
    .catch(err => {
      uni.hideLoading();
      console.error(err);
      uni.showToast({
        title: `${errCodes[err.data?.error] || '登录失败'}:${
          errDescriptions[err.data?.error_description] || err.data?.error_description
        }`,
        icon: 'none',
      });
    })
    .finally(() => {
      isErpLoginPending.value = false;
    });
};

jsBridgeReady()
  .then(() => {
    getAuth()
      .then(async res => {
        console.log('getAuth', JSON.stringify(res));
        const { header, user } = res.result;
        erpUser.value = {
          name: user.name || user.email || '',
          avatar: user.headImage || user.avatar || '/static/logo.png',
          positionName: user.positionName || '',
        };
        appAuthInfo.value = res.result;
      })
      .catch(err => {
        console.error('getAuth error', err);
        uni.showToast({ icon: 'none', title: '登录失败' });
      });
  })
  .catch(err => {
    console.error('jsBridgeReady error', err);
    // uni.showToast({ icon: 'none', title: `登录失败-${err}` });
  })
  .finally(() => {
    // uni.hideLoading();
  });
</script>

<style lang="scss" scoped></style>
