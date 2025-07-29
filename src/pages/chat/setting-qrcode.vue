<template>
  <z-paging
    ref="pagingRef"
    :refresher-only="true"
    @refresh="onRefresh"
    :defaultPageSize="999"
    :auto="true"
  >
    <template #top>
      <AppNavBar :title="title" :isBack="true" :border="true"></AppNavBar>
    </template>
    <div>qrcode</div>
  </z-paging>
</template>
<script lang="ts" setup>
import AppNavBar from '@/components/AppNavBar.vue';
import Cell from './components/Cell.vue';
import CellGroup from './components/CellGroup.vue';
import ChatObject from './components/ChatObject.vue';
const props = defineProps({
  title: {
    type: String,
    default: '聊天设置',
  },
});

const pagingRef = ref();
const title = ref(props.title);
const onRefresh = () => {
  console.log('onRefresh');
  pagingRef.value?.complete();
};
</script>
