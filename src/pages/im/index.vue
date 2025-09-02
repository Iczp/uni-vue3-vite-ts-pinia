<template>
  <view class="page-container">
    <nav-btn @click="onNavBtnClick"></nav-btn>
    <!-- {{ erpUserId }} -->
    <swiper class="swiper-container" :current="activeIndex" @change="onSwiperChange">
      <swiper-item v-for="(tab, index) in tabs" :key="index">
        <view class="swiper-item">
          <!-- 动态加载的组件 -->
          <component v-if="tab.isLazy" :is="tab.component" :sub="sub" ref="tabViewRefs" />
          <view v-else class="loading-placeholder">正在加载...</view>
        </view>
      </swiper-item>
    </swiper>

    <!-- 自定义底部Tab栏 -->
    <div class="custom-tabbar">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        ref="tabRefs"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="switchTab(index)"
        @dblclick="onDblclick(tab, index)"
        v-double-tap="() => dbTap(tab, index)"
      >
        <div class="flex flex-col relative flex-center">
          <i class="tab-icon text-28" :class="tab.icon"></i>
          <text class="tab-text">{{ tab.text }}</text>
          <Badge :count="tab.badge?.()" :absolute="true" class="absolute"></Badge>
        </div>
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
    <ChatObjectPop />
    <!-- <u-popup v-model="show" mode="left" width="40%">
      <div v-for="item in store.chatObjects" :key="item.id">
        <u-avatar :src="item.thumbnail" :size="36"></u-avatar>
        <span class="text-14 font-bold text-ellipsis max-w-88">{{ item.name }}</span>
      </div>
    </u-popup> -->
  </view>
</template>

<script setup>
import { openObjectPicker } from '@/hooks/usePicker';

import ChatObjectPop from '@/pages/im/widgets/ChatObjectPop.vue';
import { useChatStore } from '@/store/chatStore';
import NavBtn from '@/pages/im/components/nav-btn.vue';
import Badge from '@/pages/im/components/Badge.vue';
import { useAuthPage } from '@/hooks/useAuthPage';
import doubleTap from '@/directives/doubleTap';
const store = useChatStore();
useAuthPage();
const props = defineProps({
  chatObjectId: {
    type: [String, Number, null],
    default: null,
  },
  sub: {
    type: String,
    default: '',
  },
  erpUserId: {
    type: String,
    default: '',
  },
  tabIndex: {
    type: [String, Number, undefined],
    default: 0,
  },
  token: {
    type: [String, null, undefined],
    default: null,
  },
});

console.log('store.current', store.current);
const tabRefs = ref([]);
const tabViewRefs = ref([]);
const chatObjectId = Number(props.chatObjectId);
const erpUserId = props.erpUserId;
const token = props.token;

console.log('chatObjectId:', chatObjectId);
console.log('erpUserId:', erpUserId);
console.log('token:', token);

const show = ref(false);

const showPopup = e => {
  console.log('showPopup', e);
  show.value = true;
};

const onNavBtnClick = e => {
  console.log('NavBtn clicked', e);

  if (e.type == 1) {
    showPopup(e);
    return;
  }
};

const onDblclick = (tab, index) => {
  console.log('onDblclick', tab, index);
  // if (tab.isDot) {
  //   openObjectPicker();
  // }
};

const dbTap = (tab, index) => {
  console.log('dbTap', tab, index);

  switch (tab.code) {
    case 'message':
      tabViewRefs.value[index]?.scrollToBadge();
      // console.log('tabRefs.value[index]', tabViewRefs.value[index]);
      break;
    case 'contact':
    default:
      break;
  }
  // if (tab.isDot) {
  //   openObjectPicker();
  // }
};

uni.$on('showPopup@chat-index', showPopup);

const isPopVisible = ref(false);
// Tab栏配置
const tabs = ref([
  {
    code: 'message',
    text: '消息',
    icon: 'i-ic:round-message',
    isLazy: true,
    badge: () => store.totalBadges,
    isDot: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/messages/message.vue'))),
  },
  {
    code: 'contact',
    text: '通讯录',
    icon: 'i-ic:baseline-switch-account',
    isLazy: false,
    badge: () => 0,
    isDot: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/contacts/contacts.vue'))),
  },
  {
    code: 'square',
    text: '广场',
    icon: 'i-ic:baseline-switch-account',
    isLazy: false,
    badge: () => 0,
    isDot: false,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/squares/square.vue'))),
  },
  {
    code: 'mine',
    text: '我的',
    icon: 'i-ic:round-person',
    isLazy: false,
    badge: () => 0,
    isDot: true,
    component: markRaw(defineAsyncComponent(() => import('@/pages/im/mine/mine.vue'))),
  },
]);

const activeIndex = ref(Number(props.tabIndex) || 0);
const tab = tabs.value[activeIndex.value] || tabs.value[0];
if (tab && !tab.isLazy) {
  tab.isLazy = true;
}
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
const reload = () => {
  store
    .getChatObjects()
    .then(res => {
      console.log('getChatObjects:', res);
    })
    .catch(err => {
      console.error('Error fetching chat objects:', err);
    });
  store
    .getBadges()
    .then(res => {
      console.log('getBadges:', res);
    })
    .catch(err => {
      console.error('Error fetching badges:', err);
    });
};
onLoad(req => {
  // 页面隐藏时可以执行一些清理操作
  console.log('Chat index onLoad', req);
  uni.$off('refresh@chat-index');
  uni.$on('refresh@chat-index', e => {
    console.warn('refresh@chat-index', e);
    reload();
  });
  reload();
});

onUnload(() => {
  console.log('Chat index onUnload');
  uni.$off('refresh@chat-index');
});
onHide(() => {
  // 页面隐藏时可以执行一些清理操作
  console.log('Chat index page onHide');
});
onShow(e => {
  // 页面显示时可以执行一些初始化操作
  console.log('Chat index page onShow', e);
});
</script>
<style>
body,
html,
page {
  overflow: hidden;
  -webkit-overflow-scrolling: touch; /* 或者尝试 'auto' 或 'none' */
}
</style>
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
  --tab-bar-border-height: 120rpx;
  display: flex;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  // position: fixed;
  // align-items: center;
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
