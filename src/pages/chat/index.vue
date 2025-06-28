<template>
  <view class="page-container">
    <nav-btn></nav-btn>

    <swiper class="swiper-container" :current="activeIndex" @change="onSwiperChange">
      <swiper-item v-for="(tab, index) in tabs" :key="index">
        <view class="swiper-item">
          <!-- 动态加载的组件 -->
          <component :is="tab.component" />
        </view>
      </swiper-item>
    </swiper>

    <!-- 自定义底部Tab栏 -->
    <view class="custom-tabbar">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="switchTab(index)"
      >
        <image v-if="activeIndex === index" :src="tab.selectedIcon" class="tab-icon" />
        <image v-else :src="tab.icon" class="tab-icon" />
        <text class="tab-text">{{ tab.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import NavBtn from './components/nav-btn.vue';

// 动态导入的组件 - 按需加载
const Home = shallowRef(null);
const Category = shallowRef(null);
const Cart = shallowRef(null);
const Mine = shallowRef(null);

// Tab栏配置
const tabs = ref([
  {
    text: '消息',
    icon: '/static/tabs/home.png',
    selectedIcon: '/static/tabs/home-active.png',

    component: markRaw(defineAsyncComponent(() => import('@/pages/chat/message.vue'))),
  },
  {
    text: '通讯录',
    icon: '/static/tabs/home.png',
    selectedIcon: '/static/tabs/home-active.png',
    component: markRaw(defineAsyncComponent(() => import('@/pages/chat/message.vue'))),
  },
  {
    text: '我的',
    icon: '/static/tabs/home.png',
    selectedIcon: '/static/tabs/home-active.png',
    component: markRaw(defineAsyncComponent(() => import('@/pages/chat/message.vue'))),
  },
]);

const activeIndex = ref(0);

// 切换Tab
const switchTab = index => {
  activeIndex.value = index;
};

// Swiper切换事件
const onSwiperChange = e => {
  activeIndex.value = e.detail.current;
};
</script>
<!-- <script lang="ts" setup>
import TabBar from './components/tab-bar.vue';

const current = ref(0);
</script> -->

<style lang="scss" scoped>
.page-container {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100vh;
}
.swiper-container {
  flex: 1;
  height: calc(100vh - 50px);
}
.swiper-item {
  width: 100%;
  height: 100%;
}
.custom-tabbar {
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
}
.tab-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.tab-icon {
  margin-bottom: 2px;
  width: 24px;
  height: 24px;
}
.tab-text {
  font-size: 10px;
  color: #666;
}
.tab-item.active .tab-text {
  color: #ff5a5f;
}
</style>
