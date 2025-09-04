<template>
  <view class="tab-bar" :class="ui">
    <scroll-view
      class="scroll-h"
      :scroll-x="true"
      :scroll-y="false"
      :show-scrollbar="false"
      :scroll-into-view="scrollInto"
      :scroll-with-animation="true"
      @scroll="onScroll"
    >
      <view
        v-for="(item, index) in tabs"
        :key="index"
        class="tab-item"
        :id="'tab-item-' + index"
        :class="{ active: index === tabIndex }"
        @click="handleChange(index)"
      >
        <view class="tab-item-content">
          <view>
            <text>{{ item.name }}</text>
            <text v-if="item.badge && badgeMode !== 'pop'">({{ item.badge }})</text>
          </view>
          <view v-if="item.isDot" class="dot"></view>
          <view v-else-if="item.badge && badgeMode === 'pop'" class="badge">{{ item.badge }}</view>
        </view>
      </view>
      <view v-if="tabs.length !== 0" class="tab-line-active" :style="activeStyle"></view>
    </scroll-view>
    <view class="line-h"></view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
const emit = defineEmits(['change']);
// Props
const props = defineProps({
  tabs: Array,
  current: Number,
  iv: Array,
  ui: String,
  badgeMode: String,
});

// Reactive state
const scrollInto = ref('');
const tabIndex = ref(props.current);
const activeLeft = ref(16);
const activeWidth = ref(0);
const scrollInfo = ref({ scrollLeft: 0 });

// Computed property
const activeStyle = computed(() => ({
  left: activeLeft.value + 'px',
  width: activeWidth.value + 'px',
}));

// Watchers
watch(
  () => props.current,
  v => {
    nextTick(() => {
      switchTab(v);
    });
  },
);

watch(
  () => props.iv,
  v => {
    if (Array.isArray(v)) {
      // You can update activeLeft and activeWidth based on v if needed
    }
  },
  { immediate: true },
);

// Methods
const switchTab = index => {
  const item = props.tabs[tabIndex.value];
  const el = `tab-item-${index}`;
  uni
    .createSelectorQuery()
    .in(this)
    .select(`#${el}`)
    .boundingClientRect(data => {
      activeLeft.value = scrollInfo.value.scrollLeft + Number(props.iv || 0) + (data?.left || 16);
      activeWidth.value = data?.width || 1;
      scrollInto.value = el;
    })
    .exec();

  tabIndex.value = index;
  emit('change', index);
};

const handleChange = index => {
  switchTab(index);
};

const onScroll = e => {
  scrollInfo.value = e.detail;
  console.log('onScroll', e);
};

// Lifecycle hook
onMounted(() => {
  setTimeout(() => {
    nextTick(() => {
      switchTab(props.current);
    });
  }, 2000);
});
</script>

<style scoped lang="scss">
.content {
  flex-wrap: nowrap;
}
.tab-bar {
  --height: 88rpx;
  flex-wrap: nowrap;
  width: 100%;
}
.tab-bar.border-bottom {
  border-bottom: 1rpx solid rgba(224, 224, 224, 1);
}
.scroll-h {
  flex-direction: row;
  box-sizing: border-box;
  /* background-color: #fff; */
  width: 100%;
  white-space: nowrap;
}
.tab-item {
  display: inline-flex;
  position: relative;
  flex-wrap: nowrap;
  margin-left: 24rpx;
  height: var(--height);
  line-height: var(--height);
  /* padding: 0 16rpx; */
  font-weight: 500;
  font-size: 28rpx;
  color: rgba(144, 144, 144, 1);
  /* #ifndef APP-PLUS */
  white-space: nowrap;
  /* #endif */
}
.dot {
  display: flex;
  position: absolute;
  right: -12rpx;
  top: 24rpx;
  border-radius: 50%;
  width: 12rpx;
  height: 12rpx;
  background-color: rgba(200, 22, 29, 1);
  box-shadow: 0 0 10rpx rgba(200, 22, 29, 0.5);
}
.tab-item.active {
  font-weight: bold;
  color: rgba(200, 22, 29, 1);
}
.flexend {
  position: absolute;
  right: 24rpx;
}
.tab-line-active {
  position: absolute;
  bottom: 0rpx;
  z-index: 2;
  /* transform: rotate(0deg);
		transform-origin: 15px 15px; */
  border-radius: 2rpx;
  width: 6rpx;
  height: 6rpx;
  background-color: rgba(200, 22, 29, 1);
  transition-property: all;
  transition-duration: 0.3s;
}
.tab-bottom-line {
  // padding: 0 16rpx;
}
.line-h {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  height: 1rpx;
  background-color: #dfdfdf;
}
.block .tab-item {
  // padding: 0 16rpx;
}
.block .tab-line-active {
  display: none;
}
.block .tab-item-content {
  display: flex;
  position: relative;
  margin-top: 20rpx;
  padding: 0 16rpx;
  border: 1rpx solid rgba(224, 224, 224, 1);
  border-radius: 8rpx;
  height: 56rpx;
  line-height: 56rpx;
  font-size: 26rpx;
}
.border-bottom {
  .tab-item-content {
    display: flex;
    position: relative;
  }
}
.badge {
  display: inline-block;
  position: absolute;
  right: 0;
  padding: 0 8rpx;
  border: 1rpx solid white;
  border-radius: 50%;
  min-width: 36rpx;
  // top: 0;
  height: 36rpx;
  background-color: rgba(200, 22, 29, 0.8);
  line-height: 150%;
  text-align: center;
  font-size: 20rpx;
  // box-shadow: 0px 0px 6rpx rgba(200, 22, 29, 0.5);
  color: white;
  transform: translate(90%, 50%);
}
.block .tab-item.active .tab-item-content {
  border: 1rpx solid rgba(200, 22, 29, 1);
  background: rgba(200, 22, 29, 0.1);
  color: rgba(200, 22, 29, 1);
}
</style>
