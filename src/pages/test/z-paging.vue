<template>
  <app-page title="'z-paging' 分页组件">
    <z-paging ref="paging" class="paging" v-model="dataList" @query="queryList">
      <view v-slot="top" class="app-page-header" style="">
        <view class="app-nav-bar">
          <view class="app-nav-bar-title">z-paging99999999999999</view>
        </view>
      </view>

      <!-- z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住 -->
      <!-- 需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏 -->

      z-paging默认铺满全屏，此时页面所有view都应放在z-paging标签内，否则会被盖住
      需要固定在页面顶部的view请通过slot="top"插入，包括自定义的导航栏

      <view class="item" v-for="(item, index) in 100" :key="index">
        <view class="item-title">{{ item }}</view>
      </view>

      <view class="item" v-for="(item, index) in dataList" :key="index">
        <view class="item-title">{{ item.title }}</view>
      </view>
    </z-paging>
  </app-page>
</template>

<script setup>
import { ref } from "vue";
const paging = ref(null);
// v-model绑定的这个变量不要在分页请求结束中自己赋值，直接使用即可
const dataList = ref([]);

// @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
const queryList = (pageNo, pageSize) => {
  // 此处请求仅为演示，请替换为自己项目中的请求

  setTimeout(() => {
    // 模拟请求延时
    console.log("模拟请求数据", pageNo, pageSize);
    paging.value.complete([{ title: `第${pageNo}页数据` }]);
  }, 1000);
};
</script>

<style lang="scss" scoped>
.paging {
  padding-top: calc(var(--status-bar-height) + var(--app-nav-bar-height));
}
</style>
