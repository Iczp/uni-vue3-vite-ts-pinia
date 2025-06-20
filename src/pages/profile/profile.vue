<script setup>
import { onMounted, reactive, ref } from 'vue';
import { onLoad, onReachBottom } from '@dcloudio/uni-app';
import { scanCode, setNavigationBarColor } from '@/utils/bridge';
import AppPage from '@/components/AppPage.vue';

// import { resolve } from "../../commons/selector";
// import { setStatusBarStyle } from "../../commons/h5plus";

import { useKeyboard } from '@/hooks/keyboard';

const props = defineProps({
  title: {},
});

const { keyboardHeight, isKeyboardVisible, isLandscape } = useKeyboard();

// setStatusBarStyle("light");

const isLoading = ref(false);

const env = ref(import.meta.env);

const devUrl = ref(import.meta.url);

const showTop = ref(false);

onMounted(() => {
  setNavigationBarColor({
    frontColor: '#ffffff',
    backgroundColor: '#ff0000',
  });
});
const inputValue = ref('');
const keyboardheightchange = e => {
  console.log('keyboardheightchange', JSON.stringify(e));
};

const onRefresh = e => {
  isLoading.value = false;
};
const event = ref(null);
const query = reactive({});
// const title = ref('')
onLoad(req => {
  // title.value = `title:${req.title}`
  console.log('req', req);
  event.value = req.title;
});

const sysInfo = ref();
const scanResult = ref('');

const onScan = () => {
  scanResult.value = null;
  scanCode({
    success(res) {
      console.log(`条码类型：${res.scanType}`);
      console.log(`条码内容：${res.result}`);
    },
  })
    .then(res => {
      scanResult.value = res;
      console.log('res：', JSON.stringify(res));
      // resolve(event.value, res);
    })
    .catch(err => {
      console.log('scanCode err:', JSON.stringify(err));
    });
};

onReachBottom(e => {
  console.log('onReachBottom:', JSON.stringify(e));
});
</script>

<template>
  <AppPage
    :title="title"
    status-bar-background-color="#C8161D"
    title-background-color="#C8161D"
    title-color="white"
  >
    <van-popup v-model:show="showTop" position="bottom" :style="{ height: '30%' }" />

    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <van-cell-group title="分组1">
        <van-cell title="单元格" value="内容" is-link />
        <van-cell title="单元格" value="内容" label="描述信息" is-link @click="showTop = true" />
      </van-cell-group>

      <van-cell-group title="分组1">
        <van-cell title="扫一扫" size="large" is-link @click="onScan" />
      </van-cell-group>
      devUrl:
      <scroll-view :scroll-y="true" :scroll-x="true">
        <pre>{{ devUrl }}</pre>
      </scroll-view>

      <h3>env：</h3>
      <scroll-view :scroll-y="true" :scroll-x="true">
        <pre>{{ env }}</pre>
      </scroll-view>

      <h3>sysInfo：</h3>
      sysInfo:{{ sysInfo }}

      <van-button type="default" class="scan" @click="onScan">扫一扫</van-button>

      <h3>scanResult：</h3>
      <scroll-view :scroll-y="true" :scroll-x="true">
        <pre>{{ scanResult }}</pre>
      </scroll-view>

      <h3>移动端键盘高度侦测</h3>
      <div class="status">
        <p>
          键盘是否可见:
          <strong>{{ isKeyboardVisible ? '是' : '否' }}</strong>
        </p>
        <p>
          键盘实时高度:
          <strong>{{ keyboardHeight.toFixed(2) }} px</strong>
        </p>
        <p>
          当前屏幕方向:
          <strong>{{ isLandscape ? '横屏 (Landscape)' : '竖屏 (Portrait)' }}</strong>
        </p>
      </div>

      <!-- <uni-easyinput
        v-model="inputValue"
        placeholder="请输入内容"
        @keyboardheightchange="keyboardheightchange"
      ></uni-easyinput> -->

      <div v-for="(item, index) in 100" :key="index">
        {{ index }}
      </div>
      {{ title }}

      <van-loading type="spinner" />
    </van-pull-refresh>

    <template #footer>
      <div class="flex px-12 py-8 items-center felx-1">ddd</div>
    </template>
  </AppPage>
</template>

<style lang="scss" scoped>
page {
  // background-color: white;
}
.scan {
  --size: 240rpx;
  border-radius: 50%;
  width: var(--size);
  height: var(--size);
  background-color: var(--red);
  font-size: 32rpx;
  color: white;
}
</style>
