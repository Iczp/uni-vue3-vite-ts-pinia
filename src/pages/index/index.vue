<script setup lang="ts">
import { useBridge } from "@/hooks/bridge";
import { useTitle } from "@/hooks/useTitle";
import { navTo } from "@/utils/nav";
import { forward } from "@/utils/router";

const { title, changeTitle } = useTitle();

useBridge();
function goTest() {
  forward("test", {
    a: 1,
  });
}

function goScan() {
  navTo("/pages/test/scan", {
    title: "扫码",
  });
}
const bg = ref("#02dd64");
const color = ref("#82f7e4");
</script>

<template>
  <!-- :statusBarBackgroundColor="bg" :titleBackgroundColor="bg" :titleColor="color" -->
  <AppPage :title="'首页'">
    <van-cell-group title="分组1">
      <van-cell title="扫一扫" size="large" is-link />
    </van-cell-group>

    <view class="content">
      <image class="logo" src="/static/logo.png" />
      <view class="text-area">
        <text class="title">{{ title }}</text>
      </view>

      <i class="i-ic:baseline-more-vert" />
      <i class="i-material-symbols:arrow-back-ios-new" />

      <view class="flex flex-col gap-12">
        <view @click="changeTitle">changeTitle</view>
        <view @click="goTest">测试页</view>
        <div class="i-material-symbols:arrow-back-ios-new"></div>
        <!-- <Icon icon="ic:baseline-arrow-back-ios"></Icon>
        <Icon icon="material-symbols:arrow-back">55</Icon>
        <Icon icon="mdi-alarm"></Icon>
        <Icon icon="mdi:arrange-send-backward"></Icon>
        <Icon icon="logos-vue text-3xl"></Icon>
        <Icon icon="i-carbon-sun dark:i-carbon-moon"></Icon> -->

        <view @click="goScan">Scan</view>

        <view
          class="flex flex-1 bg-red-300 text-sky-4 px-12 m-10 t-16 leading-10 rounded-10 shadow-2"
        >
          我是用UnoCss
        </view>
      </view>
    </view>

    <van-cell-group title="分组1">
      <van-cell
        v-for="(item, index) in 100"
        :key="index"
        title="扫一扫"
        :value="`${index}`"
        size="large"
        is-link
      />
    </van-cell-group>
  </AppPage>
</template>

<style scoped lang="scss">
:deep(.app-status-bar) {
  background-color: rgb(0, 213, 163, 0.01);
}
:deep(.app-nav-bar) {
  // border-bottom: 1px solid #e5e5e5;
  background-color: rgb(0, 213, 163, 0.1);
  color: #fafafa;
}
:deep(.app-page-header) {
  position: sticky;
  top: 0;
  z-index: 999;
  background-image: linear-gradient(45deg, rgb(27, 136, 131), rgb(153, 227, 6));
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // color: #82f7e4;
}
.logo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 200rpx;
  margin-bottom: 50rpx;
  width: 200rpx;
  height: 200rpx;
}
.text-area {
  display: flex;
  justify-content: center;
}
.title {
  font-size: 36rpx;
  color: #8f8f94;
}
</style>
