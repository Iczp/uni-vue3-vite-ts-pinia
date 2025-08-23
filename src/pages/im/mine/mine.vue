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
          <div class="py-12 flex flex-row gap-12" @click="changeChat">
            <Avatar :size="48" :item="owner" />
            <div class="max-w-240 flex flex-col gap-8">
              <div class="flex items-center text-ellipsis text-16 font-bold">
                <span>{{ owner?.name || '-' }}</span>
                <Gender :gender="owner?.gender" class="ml-4"></Gender>
              </div>
              <div class="text-ellipsis text-14 text-dark-50">ID: {{ owner?.id }}</div>
              <div class="text-ellipsis text-14 text-dark-50">
                账号: {{ owner?.code }}
              </div>
              <div class="text-ellipsis text-14 text-dark-100">
                地区: {{ owner?.area || '-' }}
              </div>
            </div>
          </div>
        </template>
        <template #value>
          <div class="i-ic:round-edit" @click="onEdit"></div>
        </template>
      </Cell>
      <Cell icon="i-ic:round-edit" label="编辑" arrow></Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-recycling" label="好友圈" arrow>
        <template #value>
          <Badge class="gray" :count="10"></Badge>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell icon="i-ic:round-star" label="收藏夹" arrow>
        <template #value>
          <Badge class="gray" :count="favoritedCount"></Badge>
        </template>
      </Cell>
      <Cell icon="i-ic:round-favorite" label="特别关注" arrow>
        <template #value>
          <Badge class="gray" :count="followingCount"></Badge>
        </template>
      </Cell>
      <Cell icon="i-ic:round-favorite-border" label="关注我的" arrow>
        <template #value>
          <Badge class="gray" :count="followerCount"></Badge>
        </template>
      </Cell>
    </CellGroup>

    <CellGroup>
      <Cell
        icon="i-ic:round-account-circle"
        label="账号"
        :arrow="true"
        @click="navToAccount"
      ></Cell>
    </CellGroup>
  </z-paging>
</template>

<script lang="ts" setup>
import CellGroup from '@/pages/im/components/CellGroup.vue';
import Cell from '@/pages/im/components/Cell.vue';
import Badge from '@/pages/im/components/Badge.vue';
import Avatar from '@/pages/im/components/Avatar.vue';
import Gender from '@/pages/im/components/Gender.vue';
import { useUser } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { useChatStore } from '@/store/chatStore';
import { getChatObjectDetail, getChatObjectProfile } from '@/api/chatApi';
import { navTo } from '@/utils/nav';

const chatStore = useChatStore();

const userStore = useUser();

const authStore = useAuthStore();

const env = ref(import.meta.env);
const pagingRef = ref();

const chatObjectProfile = ref<Chat.ChatObjectProfileDto>();

const owner = computed(() => chatObjectProfile.value?.owner || chatStore.current);
const followingCount = computed(() => chatObjectProfile.value?.followingCount);
const followerCount = computed(() => chatObjectProfile.value?.followerCount);
const favoritedCount = computed(() => chatObjectProfile.value?.favoritedCount);

const changeChat = () => {
  uni.$emit('showPopup@chat-index');
};
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
      .catch(err => {
        pagingRef.value?.complete(false);
      });
  } else {
    uni.showToast({ icon: 'none', title: '请先登录' });
    pagingRef.value?.complete(true);
  }
};

watch(
  () => chatStore.current?.id,
  (newVal, oldVal) => {
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
const onEdit = () => {
  navTo({ url: '/pages/im/mine/edit', query: { id: chatStore.current?.id } });
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
