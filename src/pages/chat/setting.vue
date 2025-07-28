<template>
  <div class="setting-page" :style="pageStyle">
    <AppNavBar :title="title" :isBack="true" :border="true"></AppNavBar>
    <div>isHtml5Plus:{{ isHtml5Plus }}</div>
    <div>{{ userAgent }}</div>

    <div class="flex flex-row"></div>

    <CellGroup label="群设置">
      <Cell label="名称" class="border-after border-before" :value="groupName" arrow></Cell>
      <Cell label="二维码" class="border-after" valueIcon="i-ic:round-qrcode" arrow></Cell>
    </CellGroup>

    <CellGroup label="设置">
      <Cell label="免打扰" class="border-after border-before" arrow></Cell>
      <Cell
        label="二维码"
        class="border-after"
        valueIcon="i-ic:round-qrcode"
        :value="'dddd45646'"
        arrow
      ></Cell>
    </CellGroup>
  </div>
</template>

<script lang="ts" setup>
// import MessageViewer from './components/MessageViewer.vue';
import Cell from './components/Cell.vue';
import CellGroup from './components/CellGroup.vue';
import ChatInput from './components/ChatInput.vue';
import { getSessionUnitItem, getSessionUnitItemDetail } from '@/api/chatApi';
import { isHtml5Plus } from '@/utils/platform';
import { ObjectTypes } from '@/utils/enums';
const props = defineProps({
  // sessionUnitId
  id: {
    type: [String],
    default: 'e52bacf4-c231-061a-6628-3a0b0cf571fb',
    // required: true,
  },
  title: {
    type: String,
    default: '聊天设置',
  },
});

const userAgent = navigator.userAgent;

const title = ref(props.title);
const sessionUnit = ref<Chat.SessionUnitDto | null>(null);
const setting = computed(() => sessionUnit.value?.setting);
const destination = computed(() => sessionUnit.value?.destination);
const isInputEnabled = computed(() => setting.value?.isInputEnabled || false);
const isShopkeeperOrWaiter = computed(() =>
  [ObjectTypes.ShopKeeper, ObjectTypes.ShopWaiter].includes(
    sessionUnit.value?.ownerObjectType || ObjectTypes.Anonymous,
  ),
);

const groupName = ref('');

const isImmersed = computed(() => sessionUnit.value?.setting?.isImmersed || false);

const windowHeight = uni.getSystemInfoSync().windowHeight;
console.log(windowHeight);
const pageStyle = reactive({
  // height: `${windowHeight}px`,
});

getSessionUnitItemDetail({ id: props.id }).then(res => {
  console.log('getSessionUnitItem', res);
  title.value = res.destination?.displayName || res.destination?.name || '';
  // if (res.destination?.objectType == ObjectTypes.Room) {
  //   title.value += `(${res.sessionUnitCount})`;
  // }
  sessionUnit.value = res;

  groupName.value = res.destination?.name || '';
});

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
.settings-page {
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
