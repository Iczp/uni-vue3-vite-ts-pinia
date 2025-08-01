<template>
  <div class="session-page" :style="pageStyle">
    <AppNavBar :title="title" :isBack="true" :isMore="true" :border="true">
      <div class="flex flex-1 items-center flex-col justify-center gap-2">
        <div class="text-16 flex flex-row items-center gap-4 max-w-[64%]">
          <span class="text-ellipsis">{{ title }}</span>
          <i v-if="isImmersed" class="text-14 text-gray-400 i-ic:baseline-notifications-off"></i>
        </div>
        <div
          v-if="sessionUnit?.sessionUnitCount && destination?.objectType == ObjectTypes.Room"
          class="text-10 text-sky-500"
        >
          共有 {{ sessionUnit?.sessionUnitCount }} 人
        </div>
      </div>

      <template #right>
        <div class="text-20 flex flex-row gap-8">
          <div v-if="isShopkeeperOrWaiter" class="text-20 i-ic:round-electrical-services"></div>
          <div class="text-20 i-ic:round-more-horiz" @click="onMoreClick"></div>
        </div>
      </template>
    </AppNavBar>
    <MessageViewer :sessionUnitId="id" class="flex-1"></MessageViewer>
    <div>{{ pageStyle }}/{{ windowHeight }}</div>
    <ChatInput :enabled="isInputEnabled" />
  </div>
</template>

<script lang="ts" setup>
// import MessageViewer from './components/MessageViewer.vue';
import MessageViewer from './components/MessageViewer-zpaging.vue';
import ChatInput from './components/ChatInput.vue';
import { getSessionUnitItem, getSessionUnitItemDetail } from '@/api/chatApi';
import { ObjectTypes } from '@/utils/enums';
import { navToSetting } from '@/utils/nav';
const props = defineProps({
  // sessionUnitId
  id: {
    type: [String],
    default: 'e52bacf4-c231-061a-6628-3a0b0cf571fb',
    // required: true,
  },
  title: {
    type: String,
  },
});

const title = computed(
  () =>
    destination.value?.displayName ||
    destination.value?.name ||
    decodeURIComponent(props.title || '聊天'),
);
const sessionUnit = ref<Chat.SessionUnitDto | null>(null);
const setting = computed(() => sessionUnit.value?.setting);
const destination = computed(() => sessionUnit.value?.destination);
const owner = computed(() => sessionUnit.value?.owner);
const isInputEnabled = computed(() => setting.value?.isInputEnabled || false);
const isShopkeeperOrWaiter = computed(() =>
  [ObjectTypes.ShopKeeper, ObjectTypes.ShopWaiter].includes(
    sessionUnit.value?.ownerObjectType || ObjectTypes.Anonymous,
  ),
);

const isImmersed = computed(() => sessionUnit.value?.setting?.isImmersed || false);

const windowHeight = uni.getSystemInfoSync().windowHeight;
console.log(windowHeight);
const pageStyle = reactive({
  // height: `${windowHeight}px`,
});
// uni.getStorage({
//   key: `sessionUnit-${props.id}`,
//   success: res => {
//     console.log('sessionUnitJson', res.data);
//     sessionUnit.value = JSON.parse(res.data);
//     // title.value = destination.value?.displayName || destination.value?.name || '';
//   },
//   fail: () => {
//     console.log('No session unit found in storage');
//   },
// });

const sessionUnitJson = uni.getStorageSync(`sessionUnit-${props.id}`);
if (sessionUnitJson) {
  sessionUnit.value = JSON.parse(sessionUnitJson);
  // title.value = destination.value?.displayName || destination.value?.name || '';
}

getSessionUnitItemDetail({ id: props.id })
  .then(res => {
    console.log('getSessionUnitItem', res);
    res.localTime = new Date();
    sessionUnit.value = res;
    uni.setStorageSync(`sessionUnit-${props.id}`, JSON.stringify(res));
    // title.value = destination.value?.displayName || destination.value?.name || '';
  })
  .catch(err => {
    console.error('Error fetching session unit item:', err);
  });
const onMoreClick = () => {
  console.log('onMoreClick');
  navToSetting({
    id: props.id,
    objectType: sessionUnit.value?.destination?.objectType,
    // title: '聊天设置',
    count: sessionUnit.value?.sessionUnitCount,
  });
};

onMounted(() => {
  console.log('mounted');
  window.visualViewport?.addEventListener('resize', () => {
    // pageStyle.height = `${window?.visualViewport?.height}px`;
  });
});
</script>
<style>
html {
  overflow: hidden;
}
</style>
<style lang="scss" scoped>
.session-page {
  display: flex;
  overflow: hidden;
  position: fixed;
  top: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  // width: 100%;
  // height: calc(506px - var(--window-top));
  // height: 100vh;
}
.nav-bar {
  flex-shrink: 0;
  padding-top: 44px;
  height: 44px;
  background: #eee;
}
</style>
