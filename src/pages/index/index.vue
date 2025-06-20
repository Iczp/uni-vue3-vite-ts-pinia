<script setup lang="ts">
import { useBridge } from '@/hooks/bridge';
import { useTitle } from '@/hooks/useTitle';
import { forward } from '@/utils/router';

const { title, changeTitle } = useTitle();

useBridge();
function goTest() {
  forward('test', {
    a: 1,
  });
}
</script>

<template>
  <view class="content">
    <image class="logo" src="/static/logo.png" />
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
    <view @click="changeTitle">changeTitle</view>
    <view @click="goTest">测试页</view>

    <view class="flex flex-1 bg-red-300 text-sky-4 px-12 m-10 t-16 leading-10 rounded-10 shadow-2">
      我是用UnoCss
    </view>
  </view>
</template>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
