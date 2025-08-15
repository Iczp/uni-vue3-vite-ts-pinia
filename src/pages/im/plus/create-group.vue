<template>
  <z-paging
    ref="pagingRef"
    :refresher-enabled="false"
    :refresher-only="false"
    @scroll="onScroll"
    :auto="false"
  >
    <template #top>
      <AppNavBar
        title="创建群"
        :isBack="true"
        :border="true"
        class="bg-white"
        backgroundColor="#ffffff"
      ></AppNavBar>
    </template>
    <div class="text-12 text-gray px-12 mt-12">创建群聊天</div>
    <CellGroup>
      <Cell label="面对面建群" help="通过验证码" arrow></Cell>
    </CellGroup>

    <CellGroup>
      <Cell label="好友建群" help="通过邀请好友" @click="createByFriends" arrow></Cell>
    </CellGroup>
  </z-paging>
</template>

<script lang="ts" setup>
import CellGroup from '@/pages/im/components/CellGroup.vue';
import Cell from '@/pages/im/components/Cell.vue';

import { useChatStore } from '@/store/chatStore';
import { useObjectPicker } from '@/hooks/usePicker';
import { createGroup } from '@/api/chatApi';

const chatStore = useChatStore();

const pagingRef = ref();

const opacity = ref(0);

const onScroll = e => {
  // console.log("滚动事件", e);
  opacity.value = Math.min(e.detail.scrollTop / 400, 1);
  // console.log("滚动透明度", opacity.value);
};

const createByFriends = () => {
  useObjectPicker({
    selected: [],
    max: 12,
    multi: true,
    disabled: [],
    title: '选择联系人',
  }).then(res => {
    console.log('useObjectPicker', res);
    const chatObjectIdList = res?.selectedItems?.map(x => Number(x.destination.id)) || [];
    const names = res?.selectedItems?.map(x => x.destination.name) || [];
    const name = `群(${names.join(',')})`;
    uni.showLoading({ title: '正在创建群...', mask: true });
    console.log('chatObjectIdList', chatObjectIdList);

    createGroup({
      name,
      code: '',
      ownerId: chatStore.current.id,
      type: 0,
      description: name,
      chatObjectIdList: [...chatObjectIdList],
    })
      .then(() => {
        uni.hideLoading();
        uni.showToast({ title: '创建成功', icon: 'success' });
      })
      .catch(err => {
        uni.hideLoading();
        uni.showToast({ title: '创建失败', icon: 'none' });
      })
      .finally(() => {});
  });
};
onMounted(() => {
  // 页面加载时可以执行一些初始化操作
  console.log('Message page mounted');
});
</script>

<style lang="scss" scoped></style>
