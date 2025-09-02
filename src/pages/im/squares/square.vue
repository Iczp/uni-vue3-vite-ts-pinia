<template>
  <z-paging
    ref="pagingRef"
    :refresher-only="true"
    @scroll="onScroll"
    @onRefresh="onRefresh"
    :auto="false"
  >
    <template #top>
      <AppNavBar
        :title="title"
        :isBack="false"
        :border="false"
        class="bg-white"
        backgroundColor="#ffffff"
      ></AppNavBar>
    </template>
    <div>广场</div>
  </z-paging>
</template>

<script lang="ts" setup>
import CellGroup from '@/pages/im/components/CellGroup.vue';
import Cell from '@/pages/im/components/Cell.vue';
import { useChatStore } from '@/store/chatStore';
import { getChatObjectProfile } from '@/api/chatApi';
import { navTo } from '@/utils/nav';

const title = ref('广场');

const chatStore = useChatStore();

const pagingRef = ref();

const chatObjectProfile = ref<Chat.ChatObjectProfileDto>();

const onRefresh = () => {
  loadData();
  console.log('刷新');
};
const opacity = ref(0);

const loadData = () => {
  if (chatStore.current?.id) {
    getChatObjectProfile({ id: chatStore.current?.id })
      .then(res => {
        chatObjectProfile.value = res;
        pagingRef.value?.complete(true);
      })
      .catch(() => {
        pagingRef.value?.complete(false);
      });
  } else {
    uni.showToast({ icon: 'none', title: '请先登录' });
    pagingRef.value?.complete(true);
  }
};

watch(
  () => chatStore.current?.id,
  () => {
    if (chatStore.current?.id) {
      loadData();
    }
  },
);

const onScroll = e => {
  // console.log("滚动事件", e);
  opacity.value = Math.min(e.detail.scrollTop / 400, 1);
  // console.log("滚动透明度", opacity.value);
};
const navToAccount = () => {
  navTo({ url: `/pages/account/profile`, query: {} });
};
onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
  loadData();
});
</script>

<style lang="scss" scoped></style>
