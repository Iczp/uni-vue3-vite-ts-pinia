<template>
  <AppPage :title="title">
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      van

      <van-cell title="下拉刷新示例" />
      <van-cell title="加载更多内容" />
      <van-cell title="更多内容" />
      <van-cell title="更多内容" />
      <van-cell title="更多内容" />
      <van-cell v-for="item in 100" :key="item" :title="item" is-link />
    </van-pull-refresh>

    <template #footer>
      <div class="flex justify-between p-12 flex-center bg-white">
        <van-button type="primary" @click="onRefresh">手动刷新</van-button>
        <van-button type="default" @click="isLoading = !isLoading"
          >ddd</van-button
        >

      </div>
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
import AppPage from "@/components/AppPage.vue";
defineProps({
  title: {
    type: String,
    default: "选择器",
  },
});

const isLoading = ref(false);
const onRefresh = (e) => {
  console.log("开始刷新", e);
  isLoading.value = false;
  // isLoading.value = true;
  // setTimeout(() => {
  //   isLoading.value = false;
  //   console.log("刷新成功");
  // }, 1000);
};
</script>
