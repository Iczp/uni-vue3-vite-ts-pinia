<template>
  <!-- :statusBarBackgroundColor="bg" :titleBackgroundColor="bg" :titleColor="color" -->
  <AppPage :title="'首页'">
    <van-cell-group title="分组1">
      <van-cell title="选择器" size="large" is-link @click="onSelector" />

      <van-cell title="聊天" size="large" is-link @click="onChat" />

      selectorInfo:{{ selectorInfo }}

      <h3>params:</h3>
      <u-button @click="pushEvents">===</u-button>
      <view v-for="(item, index) in params" :key="index">{{ item }}</view>

      <van-cell
        title="Z-Paging"
        size="large"
        is-link
        @click="navTo({ url: '/pages/test/z-paging', query: { title: 'Z-Paging' } })"
      />
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
      <van-cell title="扫码签到" value="onScan" label="扫码签到" @click="onScan" isLink />

      <van-cell title="更改标题" value="setTitle" @click="setTitle" isLink />

      <van-cell title="获取信息信息" value="getSysInfo" @click="getSysInfo" isLink />

      <view class="bg-gray-1 p-12">
        <scroll-view :scroll-y="true" :scroll-x="true">
          <pre>{{ sysInfo }}</pre>
        </scroll-view>
      </view>

      <van-cell title="获取登录信息" value="auth" @click="onAuth" isLink />

      <view class="bg-gray-1 p-12">
        <scroll-view :scroll-y="true" :scroll-x="true">
          <pre>{{ authInfo }}</pre>
        </scroll-view>
      </view>
    </van-cell-group>

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

<script setup lang="ts">
import { useBridge } from '@/hooks/bridge';
import { useTitle } from '@/hooks/useTitle';
import { navTo } from '@/utils/nav';
import { forward } from '@/utils/router';
import {
  $emit,
  $on,
  $once,
  getAuth,
  getSystemInfo,
  navToWebview,
  setNavigationBarColor,
} from '@/commons/bridge';
import { selector } from '@/utils/selector';
const { title, changeTitle } = useTitle();

useBridge();
function goTest() {
  forward('test', {
    a: 1,
  });
}

const onChat = () => {
  navToWebview('/pages/chat/index');
};
function goScan() {
  navTo({
    url: '/pages/test/scan',
    query: {
      title: '扫码',
    },
  });
}
const bg = ref('#02dd64');
const color = ref('#82f7e4');

const setTitle = () => {
  uni.setNavigationBarTitle({
    title: `H5标题-${new Date()}`,
  });
  setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#ff0000',
    animation: {
      duration: 400,
      timingFunc: 'easeIn',
    },
  });
};

const selectorInfo = ref();
const onSelector = () => {
  selector({
    title: '选择器',
    multiple: true,
    cancelText: '取消',
    confirmText: '确定',
  }).then(res => {
    console.log('选择结果:', res);

    selectorInfo.value = res;
  });
};

const authInfo = ref();
const sysInfo = ref();
const getSysInfo = () => {
  getSystemInfo().then(res => {
    sysInfo.value = res;
    // uni.navigateBack()
  });
};

const onAuth = () => {
  getAuth().then(res => {
    authInfo.value = res;
    console.log('getAuth' + JSON.stringify(res));
  });
};
onMounted(() => {
  setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#02dd64',
  });
});
const onScan = () => {
  uni.scanCode({
    success: res => {
      console.log(`条码类型：${res.scanType}`);
      console.log(`条码内容：${res.result}`);
    },
    fail: err => {
      console.error('scanCode error:', err);
    },
  });
};
const params = ref<any[]>(['init']);
onLoad(() => {
  console.log('onLoad');

  uni.$on('onSelector', e => {
    console.log(`H5#event:onSelector`, e);
    params.value.push(e);
  });

  $on('onSelector', res => {
    console.log('onSelector', res);
    // selectorInfo.value = res;
    // params.value.push(res);
  });
});

onUnload(() => {
  console.log('onUnload');
});

const pushEvents = () => {
  $emit('onSelector', {
    id: '123',
    name: '测试事件',
  });
};
</script>

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
