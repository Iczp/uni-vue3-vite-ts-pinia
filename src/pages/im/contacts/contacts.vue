<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="通讯录" :isBack="false" :border="false" backgroundColor="#f5f5f5">
        <!-- <template #left>
          <CurrentChatObject />
        </template> -->
      </AppNavBar>
      <PullRefresh v-model:loading="isLoading" @refresh="onRefresh" class="h-full">
        <!-- vue-virtual-scroller 必须是 PullRefresh 的直接子元素，并且可以滚动 -->
        <!-- <scroll-view :scroll-y="true" class="h-full"> -->
          <div v-for="(item, index) in list" :key="index" class="p-8">
            <div class="user">{{ item.name }} {{ item.id }}</div>
          </div>
        <!-- </scroll-view> -->

        <!-- <RecycleScroller
          class="scroller"
          :items="list"
          :item-size="50"
          key-field="id"
          v-slot="{ item }"
        >
          <div class="user">{{ item.name }} {{ item.id }}</div>
        </RecycleScroller> -->
      </PullRefresh>
    </view>
  </div>
</template>

<script lang="ts" setup>
import PullRefresh from '@/pages/im/components/PullRefresh.vue';
import { useUser } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { userHeader } from '@/api/userHeader';

const userStore = useUser();
const authStore = useAuthStore();

const env = ref(import.meta.env);
const pagingRef = ref();

// 模拟API
const fetchNewData = (): Promise<any[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newItems = Array.from({ length: 20 }, (_, i) => ({
        id: `new-${Date.now()}-${i}`,
        name: 'New Item',
      }));
      resolve(newItems);
    }, 1500);
  });
};

const isLoading = ref(false);
const list = ref(Array.from({ length: 100 }, (_, i) => ({ id: i, name: 'User' })));

const onRefresh = async () => {
  console.log('Refresh triggered!');
  // 此时 isLoading 已经被 PullRefresh 组件内部设为 true
  const newItems = await fetchNewData();
  list.value = [...newItems, ...list.value];

  // 关键：数据加载完成后，手动将 isLoading 设置为 false
  // PullRefresh 组件会监听到这个变化，并自动收起加载提示
  isLoading.value = false;
  console.log('Refresh finished!');
};

const login = () => {
  authStore.fetchToken(userHeader);
};
const refreshToken = () => {
  authStore.refreshToken();
};

onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
});
</script>

<style lang="scss" scoped></style>
