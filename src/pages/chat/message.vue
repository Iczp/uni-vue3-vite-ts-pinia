<template>
  <div class="page">
    <view class="flex flex-col line-after z-999">
      <AppNavBar title="消息" :isBack="false" :border="false" backgroundColor="#f5f5f5" />
      <view class="h-48 px-12 flex items-center justify-between">
        <u-search
          placeholder="日照香炉生紫烟"
          :focus="false"
          :animation="false"
          @search="onSearch"
          @custom="onSearch"
          v-model="query.keyword"
        ></u-search>
      </view>
    </view>

    <z-paging
      ref="pagingRef"
      class="z-paging mt-48"
      v-model="dataList"
      @query="queryList"
      @scroll="onScroll"
      :default-page-size="query.maxResultCount"
    >
      <template #empty>没有数据哦</template>

      userStore.token: {{ userStore.token }}
      <template #cell="{ item, index }">
        <view class="item-title">{{ item.title }}</view>
      </template>

      <template #loadingMoreNoMore>
        <view style="background-color: red;">这是完全自定义的没有更多数据view</view>
      </template>
    </z-paging>
  </div>
</template>

<script lang="ts" setup>
import { usePaging } from '@/hooks/usePaging';
import TabBar from './components/tab-bar.vue';
// import { useBridge } from '@/hooks/bridge';
import { useUser } from '@/store/user';
// useBridge();
const userStore = useUser();

const { pagingRef, dataList, queryList, isPending, query } = usePaging({
  pageSize: 20,
  service: queryInput => {
    // 模拟分页请求
    return new Promise(resolve => {
      setTimeout(() => {
        const items = Array.from({ length: Number(queryInput.maxResultCount || 20) }, (_, i) => ({
          id: (queryInput.skipCount || 0) + i + 1,
          title: `Item ${(queryInput.skipCount || 0) + i + 1}`,
        }));
        resolve({
          items,
          totalCount: 100, // 假设总条数为100
        });
      }, 300);
    });
  },
});

const onSearch = () => {
  console.log('搜索关键字:', query.value.keyword);
};

const opacity = ref(0);

const style = computed(() => ({
  '--app-heder-background-color': `rgba(0, 255, 255, ${opacity.value})`,
}));
const backgroundColor = `rgba(1, 0, 255, ${opacity.value})`;

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
