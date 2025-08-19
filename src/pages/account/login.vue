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

    <div class="bg-white mt-64">
      <u-form :model="form" ref="form1" class="p-12">
        <u-form-item label="账号" prop="name">
          <div class="i-ic:round-account-circle text-16 text-gray-400 mr-8"></div>
          <u-input v-model="form.account" placeholder="账号" />
        </u-form-item>
        <u-form-item label="密码" prop="name">
          <div class="i-ic:round-lock text-16 text-gray-400 mr-8"></div>
          <u-input placeholder="请输入密码" type="password" v-model="form.password" />
        </u-form-item>
      </u-form>
      <div class="flex flex-row justify-center py-12">
        <u-button type="primary">登录</u-button>
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
import Cell from '@/pages/im/components/Cell.vue';
import Badge from '@/pages/im/components/Badge.vue';
import Avatar from '@/pages/im/components/Avatar.vue';
import Gender from '@/pages/im/components/Gender.vue';
import { useUser } from '@/store/user';
import { useAuth } from '@/store/auth';
import { useChatStore } from '@/store/chatStore';
import { userHeader } from '@/api/userHeader';
import { getChatObjectDetail, getSessionUnitItemDetail } from '@/api/chatApi';
import { useSessionUnitDetail } from '@/hooks/useSessionUnitDetail';
import { objectTypeDescriptions, ObjectTypes } from '@/utils/enums';

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

const authStore = useAuth();

const pagingRef = ref();

const form = reactive({
  account: '',
  password: '',
  code: '',
  name: '',
});

const onRefresh = () => {
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
