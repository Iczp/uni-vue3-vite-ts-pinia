<template>
  <view class="page-container">
    <nav-btn @click="show = true"></nav-btn>

    <swiper class="swiper-container" :current="activeIndex" @change="onSwiperChange">
      <swiper-item v-for="(tab, index) in tabs" :key="index">
        <view class="swiper-item">
          <!-- 动态加载的组件 -->
          <component v-if="tab.isLazy" :is="tab.component" />
          <view v-else class="loading-placeholder">正在加载...</view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 自定义底部Tab栏 -->
    <div class="custom-tabbar">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="switchTab(index)"
      >
        <i class="tab-icon text-28" :class="tab.icon"></i>
        <text class="tab-text">{{ tab.text }}</text>
      </div>
    </div>

    <!-- 弹出层 -->
    <u-popup v-model="isPopVisible" mode="bottom" :mask="true" :maskClosable="true">
      <view class="h-120px flex justify-center items-center bg-white">
        <scroll-view scroll-x="true" class="popup-scroll-view">
          <view class="popup-content">
            <view class="popup-text">出淤泥而不染，濯清涟而不妖</view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
    <!-- 弹出层 -->
    <u-popup v-model="show" mode="left" width="40%">
      <div v-for="item in store.chatObjects" :key="item.id">
        <u-avatar :src="item.thumbnail" :size="36"></u-avatar>
        <span class="text-14 font-bold text-ellipsis max-w-88">{{ item.name }}</span>
      </div>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, shallowRef } from 'vue';
import NavBtn from './components/nav-btn.vue';
import { useChatObjectStore } from '@/store/chatObjectStore';
const store = useChatObjectStore();

uni.$on('refresh@chat-index', () => {
  store.getChatObjects();
  store.getBadges();
});

uni.$emit('refresh@chat-index');

const show = ref(false);

const isPopVisible = ref(false);
// Tab栏配置
const tabs = ref([
  {
    text: '消息',
    icon: 'i-ic:round-message',
    selectedIcon: '/static/tabs/home-active.png',
    path: '/pages/chat/message.vue',
    isLazy: true,
    component: markRaw(defineAsyncComponent(() => import('@/pages/chat/message.vue'))),
  },
  {
    text: '通讯录',
    icon: 'i-ic:baseline-switch-account',
    selectedIcon: '/static/tabs/home-active.png',
    path: '/pages/chat/contacts.vue',
    isLazy: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/chat/contacts.vue'))),
  },
  {
    text: '我的',
    icon: 'i-ic:round-person',
    selectedIcon: '/static/tabs/home-active.png',
    path: '@/pages/chat/profile.vue',
    isLazy: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/chat/profile.vue'))),
  },
]);

const activeIndex = ref(0);

// 切换Tab
const switchTab = index => {
  activeIndex.value = index;
};

// Swiper切换事件
const onSwiperChange = async e => {
  activeIndex.value = e.detail.current;
  const tab = tabs.value[activeIndex.value];
  if (!tab.isLazy) {
    tab.isLazy = true;
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100vh;
}
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 24rpx;
  color: #999;
}
.swiper-container {
  display: flex;
  flex: 1;
  // height: calc(100vh - 44px - 120rpx - env(safe-area-inset-bottom));
}
.swiper-item {
  width: 100%;
  height: 100%;
}
.custom-tabbar {
  --tab-bar-border-height: 112rpx;
  display: flex;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  // position: fixed;
  align-items: center;
  height: var(--tab-bar-border-height);
  background-color: #fff;
  box-shadow: 0 -1px 5rpx rgba(0, 0, 0, 0.1);
}
.tab-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  color: #666;
}
.tab-icon {
  margin-bottom: 2px;
  width: 24px;
  height: 24px;
}
.tab-text {
  font-weight: 500;
  font-size: 24rpx;
}
.tab-item.active {
  color: #c41313;
}
</style>
