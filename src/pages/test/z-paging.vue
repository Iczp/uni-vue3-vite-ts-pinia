<template>
  <app-page title="'z-paging' 分页组件">
    <z-paging
      ref="pagingRef"
      class="z-paging"
      v-model="dataList"
      @query="queryList"
    >
      <view class="app-page-header" style="">
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

<script lang="ts" setup>
import { usePaging } from "@/hooks/usePaging";
const { pagingRef, dataList, queryList } = usePaging({
  pageSize: 10,
});
</script>

<style lang="scss" scoped>
// .paging {
//   padding-top: calc(var(--status-bar-height) + var(--app-nav-bar-height));
// }
</style>
