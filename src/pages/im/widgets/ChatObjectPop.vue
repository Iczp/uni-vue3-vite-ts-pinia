<template>
  <u-popup v-model="isVisible" mode="left" :duration="duration" :closeable="false" width="60%">
    <z-paging class="bg-gray-50">
      <template #top>
        <AppNavBar title="" :isBack="false" :border="false">
          <template #right>
            <div class="i-ic:round-close text-20" @click="isVisible = false"></div>
          </template>
        </AppNavBar>
      </template>

      <div class="text-12 text-gray px-12 py-8">切换聊天</div>
      <div class="flex flex-col border-before border-after">
        <div
          v-for="(item, index) in store.items"
          :key="item.owner.id"
          @click="onChangeChat(item, index)"
          class="active"
        >
          <ChatObject
            class="px-12 py-8 flex-1 after:left-56"
            :class="{ current: item.isCurrent }"
            :size="36"
            :item="item.owner"
            :arrow="false"
            :border="index != store.chatObjects.length - 1"
          >
            <template #title>
              <div class="max-w-92 inline-block text-ellipsis">
                <span class="text-14">{{ item.owner.name }}</span>
              </div>
            </template>
            <!-- <template #desc>
              <div class="max-w-100 inline-block text-ellipsis">
                <span class="text-10 text-gray font-normal">
                  {{ objectTypeDescriptions[item.objectType] }}
                </span>
              </div>
            </template> -->
            <template #actions>
              <div class="flex flex-row gap-4 items-center">
                <Badge :count="item.badge" :class="{ gray: item.isCurrent }" />
                <div
                  v-if="item.isCurrent"
                  class="i-ic:round-check-circle text-green-500 text-16 cursor-default"
                ></div>
                <div v-else class="text-gray-400 i-ic:round-arrow-forward-ios"></div>
              </div>
            </template>
          </ChatObject>
        </div>
      </div>

      <CellGroup label="快捷">
        <Cell label="扫一扫" :arrow="true"></Cell>
        <Cell label="新建群聊" :arrow="true" @click="navToCreateGroup"></Cell>
        <Cell label="反馈" help="如有Bug,请反馈给我们" :arrow="true"></Cell>
      </CellGroup>

      <CellGroup label="账号">
        <Cell
          icon="i-ic:round-account-circle"

          :label="auth.user?.given_name"
          :arrow="true"
          :help="auth.user?.email"
          @click="navToAccount"
        ></Cell>
      </CellGroup>

      <!-- <div v-for="value in 100" class="flex p-12">
        {{ value }}
      </div> -->
      <template #bottom>
        <footer class="flex flex-center w-full border-before h-56">
          <div class="text-gray text-12">v1.0</div>
        </footer>
      </template>
    </z-paging>
  </u-popup>
</template>

<script lang="ts" setup>
import { useChatStore } from '@/store/chatStore';

import ChatObject from '@/pages/im/components/ChatObject.vue';
import Badge from '@/pages/im/components/Badge.vue';
import Cell from '@/pages/im/components/Cell.vue';
import CellGroup from '@/pages/im/components/CellGroup.vue';
import { objectTypeDescriptions } from '@/utils/enums';
import { navTo } from '@/utils/nav';
import { useAuthStore } from '@/store/auth';
const props = defineProps({
  label: {
    type: [String, null],
  },
  icon: {
    type: String,
  },
  valueIcon: {
    type: String,
  },
  arrow: {
    type: Boolean,
    default: false,
  },
});
const isVisible = ref(false);
const duration = ref(250);
const store = useChatStore();
const auth = useAuthStore();

auth.getUserInfo({});

const onChangeChat = (item: any, index: number) => {
  console.log('onChangeChat', item, index);
  if (store.currentIndex == index) {
    uni.showToast({ title: '已经是当前会话', icon: 'none' });
    return;
  }
  store.setCurrentIndex(index);
  isVisible.value = false;
};
const navToCreateGroup = () => {
  navTo({ url: `/pages/im/plus/create-group`, query: {} });
  isVisible.value = false;
  duration.value = 0;
};

const account = computed(() =>
  auth.user ? `${auth.user?.given_name}(${auth.user?.email})` : '未登录',
);

const navToAccount = () => {
  navTo({ url: `/pages/account/profile`, query: {} });
  isVisible.value = false;
  duration.value = 0;
};
const show = () => {
  isVisible.value = !isVisible.value;
  duration.value = 250;
};
const close = () => {
  isVisible.value = false;
};

uni.$on('showPopup@chat-index', show);

defineExpose({
  show,
  close,
  isVisible,
});
</script>

<style lang="scss" scoped>
.current {
  background-color: rgb(241, 241, 241);
  font-weight: bold;
}
</style>
