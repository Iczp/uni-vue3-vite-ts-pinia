<script setup lang="ts">
import { useBridge } from '@/hooks/bridge';
import { useTitle } from '@/hooks/useTitle';
import { navTo } from '@/utils/nav';
import { forward } from '@/utils/router';

const { title, changeTitle } = useTitle();

useBridge();
function goTest() {
  forward('test', {
    a: 1,
  });
}

function goScan() {
  navTo('/pages/test/scan', {
    title: '扫码',
  });
}
const bg = ref('#02dd64');
const color = ref('#82f7e4');
</script>

<template>
  <AppPage :title="'首页'" :statusBarBackgroundColor="bg" :titleBackgroundColor="bg" :titleColor="color">
    <view class="content">
      <image class="logo" src="/static/logo.png" />
      <view class="text-area">
        <text class="title">{{ title }}</text>
      </view>

      <i class="ic:baseline-more-vert"></i>


      <view class="flex flex-col gap-12">
        <view @click="changeTitle">changeTitle</view>
        <view @click="goTest">测试页</view>
        <div class="i-material-symbols:arrow-back-ios-new"></div>
        <i class="i-ic:baseline-arrow-back-ios"></i>
        <div class="material-symbols:arrow-back">55</div>
        <div class="i-mdi-alarm"></div>
        <div class="i-mdi:arrange-send-backward"></div>
        <div class="i-logos-vue text-3xl"></div>
        <div class="i-carbon-sun dark:i-carbon-moon"></div>

        <view @click="goScan">Scan</view>

        <view
          class="flex flex-1 bg-red-300 text-sky-4 px-12 m-10 t-16 leading-10 rounded-10 shadow-2"
        >
          我是用UnoCss
        </view>
      </view>
    </view>
  </AppPage>
</template>

<style scoped lang="scss">
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
