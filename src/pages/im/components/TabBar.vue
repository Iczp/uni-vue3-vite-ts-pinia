<template>
  <view class="custom-tabbar">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      class="tab-item"
      :class="{ active: activeIndex === index }"
      @click="switchTab(index)"
    >
      <!-- <image v-if="activeIndex === index" :src="tab.selectedIcon" class="tab-icon" />
        <image v-else :src="tab.icon" class="tab-icon" /> -->

      <i class="tab-icon text-28" :class="tab.icon"></i>
      <text class="tab-text">{{ tab.text }}</text>
  </div>
  </view>
</template>

<script lang="ts" setup>
// Tab栏配置
const tabs = ref([
  {
    text: '消息',
    icon: 'i-ic:round-message',
    selectedIcon: '/static/tabs/home-active.png',
    path: '/pages/im/message.vue',
    isLazy: true,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/message.vue'))),
  },
  {
    text: '通讯录',
    icon: 'i-ic:baseline-switch-account',
    selectedIcon: '/static/tabs/home-active.png',
    path: '/pages/im/contacts.vue',
    isLazy: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/contacts.vue'))),
  },
  {
    text: '我的',
    icon: 'i-ic:round-person',
    selectedIcon: '/static/tabs/home-active.png',
    path: '@/pages/im/profile.vue',
    isLazy: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/profile.vue'))),
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
.custom-tabbar {
  display: flex;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  // position: fixed;
  align-items: center;
  height: 120rpx;
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
