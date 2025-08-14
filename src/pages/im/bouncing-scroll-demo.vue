<template>
  <div class="page-container">
    <header>我的列表</header>

    <BouncingScroll
      class="my-scroll-area"
      ref="scrollRef"
      :enable-pull-to-refresh="true"
      :enable-load-more="true"
      :is-loading-more="loadingMore"
      :no-more-data="noMore"
      @refresh="onRefresh"
      @loadMore="onLoadMore"
    >
      <!-- 使用插槽自定义下拉刷新指示器 (可选) -->
      <!-- <template #pull-refresh-indicator="{ state }">
        <div class="custom-indicator">
          <span v-if="state === 'loading'">🚀 正在玩命刷新...</span>
          <span v-else-if="state === 'triggered'">松开！松开！</span>
          <span v-else>继续下拉有惊喜</span>
        </div>
      </template> -->

      <!-- 滚动内容 -->
      <div class="content-list">
        <div v-for="item in list" :key="item" class="list-item">列表项 {{ item }}</div>
      </div>
    </BouncingScroll>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BouncingScroll from './components/BouncingScroll.vue';

const scrollRef = ref(null); // 用于调用子组件的方法
const list = ref([]);
const loadingMore = ref(false);
const noMore = ref(false);
let page = 1;

// 模拟API调用
const fetchData = (isRefresh = false) => {
  return new Promise(resolve => {
    setTimeout(() => {
      if (isRefresh) {
        page = 1;
        const newList = Array.from({ length: 20 }, (_, i) => i + 1);
        resolve(newList);
      } else {
        if (page >= 3) {
          // 模拟总共3页数据
          resolve([]);
        } else {
          const start = (page - 1) * 20 + 1;
          const nextPageData = Array.from({ length: 20 }, (_, i) => start + i);
          resolve(nextPageData);
        }
      }
    }, 1500); // 模拟网络延迟
  });
};

// 下拉刷新事件处理
const onRefresh = async () => {
  console.log('触发刷新...');
  const newList = await fetchData(true);
  list.value = newList;
  noMore.value = false; // 重置没有更多数据的状态

  // 关键：告诉子组件刷新已完成
  scrollRef.value?.finishPullToRefresh();
  console.log('刷新完成！');
};

// 上拉加载更多事件处理
const onLoadMore = async () => {
  console.log('触发加载更多...');
  loadingMore.value = true; // 开始加载

  page++;
  const nextPageData = await fetchData();

  if (nextPageData.length > 0) {
    list.value.push(...nextPageData);
  } else {
    console.log('没有更多数据了');
    noMore.value = true;
  }

  loadingMore.value = false; // 加载结束
};

// 初始化加载
onMounted(async () => {
  list.value = await fetchData(true);
});
</script>

<style>
/* 页面布局样式，与之前相同 */
html,
body,
#app {
  overflow: hidden;
  margin: 0;
  height: 100%;
}
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
}
header {
  flex-shrink: 0;
  padding: 15px;
  background-color: #f0f0f0;
  text-align: center;
}
.my-scroll-area {
  flex-grow: 1;
  background-color: #f9f9f9;
}
.list-item {
  padding: 20px 15px;
  border-bottom: 1px solid #eee;
}
.list-item:last-child {
  border-bottom: none;
}
.custom-indicator {
  font-weight: bold;
  color: deeppink;
}
</style>
