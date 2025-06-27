<template>
  <AppPage :title="title" :navBarBorder="false">
    <template #header>
      <view class="page-header" :style="style">
        <AppNavBar :title="title">{{ title }}</AppNavBar>
        <view class="flex p-12 position-sticky z-10 search-bar">
          <u-search
            placeholder="日照香炉生紫烟"
            v-model="query.keyword"
          ></u-search>
        </view>
      </view>
    </template>

    <z-paging
      ref="pagingRef"
      class="z-paging"
      v-model="dataList"
      @query="queryList"
      @scroll="onScroll"
      :default-page-size="query.maxResultCount"
    >
      <u-cell-group>
        <u-cell-item icon="setting-fill" title="个人设置"></u-cell-item>
        <u-cell-item
          icon="integral-fill"
          title="会员等级"
          value="新版本"
        ></u-cell-item>
      </u-cell-group>

      <u-cell-group title="个人中心" :bordered="false">
        <u-cell-item
          v-for="(item, index) in dataList"
          :key="index"
          :title="item.title"
          :value="item.id"
          :icon="index % 2 === 0 ? 'user-fill' : 'phone-fill'"
          :is-link="true"
          @click="() => console.log('点击了', item.title)"
        ></u-cell-item>
      </u-cell-group>
    </z-paging>
    <template #footer>
      <div class="flex justify-between p-12 flex-center bg-white">
        <view class="flex flex-1 flex-center">手动刷新</view>
        <view class="">
          <u-button
            class=""

            @click="onRefresh"
            :plain="true"
            shape="circle"
            ripple-bg-color="#ff0000"
            >确定</u-button
          >
        </view>
      </div>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
// import AppPage from "@/components/AppPage.vue";
import { usePaging } from "@/hooks/usePaging";

defineProps({
  title: {
    type: String,
    default: "选择器",
  },
});

const { pagingRef, dataList, queryList, isPending, query } = usePaging({
  pageSize: 20,
  service: (queryInput) => {
    // 模拟分页请求
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = Array.from(
          { length: Number(queryInput.maxResultCount || 20) },
          (_, i) => ({
            id: (queryInput.skipCount || 0) + i + 1,
            title: `Item ${(queryInput.skipCount || 0) + i + 1}`,
          })
        );
        resolve({
          items,
          totalCount: 100, // 假设总条数为100
        });
      }, 300);
    });
  },
});
const opacity = ref(0);

const style = computed(() => ({
  "--app-heder-background-color": `rgba(0, 255, 255, ${opacity.value})`,
}));
const backgroundColor = `rgba(1, 0, 255, ${opacity.value})`;

const onScroll = (e) => {
  // console.log("滚动事件", e);
  opacity.value = Math.min(e.detail.scrollTop / 400, 1);
  // console.log("滚动透明度", opacity.value);
};

const onRefresh = (e) => {
  console.log("开始刷新", e);
  isPending.value = false;
  // isPending.value = true;
  // setTimeout(() => {
  //   isPending.value = false;
  //   console.log("刷新成功");
  // }, 1000);
};
</script>

<style lang="scss" scoped>
page {
  --search-bar-height: 96rpx;
  // background-color: wheat;
}
.page-header {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: var(--app-heder-background-color, rgb(255, 255, 255));
  transition: background-color 0.3s ease-in-out;
}
.z-paging {
  padding-top: calc(
    var(--status-bar-height) + var(--app-nav-bar-height) +
    var(--search-bar-height)
  );
  padding-bottom: calc(var(--app-footer-height));
}
.search-bar {
  position: sticky;
  // top: 0;
  top: calc(var(--status-bar-height) + var(--app-nav-bar-height));
  z-index: 999;
  height: var(--search-bar-height);
}
.search-bar::after {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.13);
  content: '';
  transform: scaleY(0.3);
}
:deep(.app-page-header) {
  // background-color: rgb(0, 255, 255);
}
:deep(.u-default-plain-hover) {
  border-color: #cad2cb;
  background-color: #ede0e0 !important;
}
</style>
