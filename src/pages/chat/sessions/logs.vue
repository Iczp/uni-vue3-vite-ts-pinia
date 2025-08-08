<template>
  <z-paging ref="pagingRef">
    <template #top>
      <AppNavBar :isMore="false" :border="true">
        <u-search placeholder="搜索内容" v-model="keyword"></u-search>
      </AppNavBar>
    </template>
    <div class="flex flex-col gap-12 flex-center mt-36">
      <div class="flex text-14 text-gray">搜索指定内容</div>
    </div>
    <div class="flex flex-center mt-24">
      <ul class="flex flex-row flex-wrap box-border gap-12 m-0 p-0">
        <li
          class="flex box-border w-[28%] flex-center text-sky-800 m-0 p-0"
          v-for="(item, index) in items"
          :key="item.code"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </z-paging>
</template>
<script lang="ts" setup>
const pagingRef = ref();
const items = [
  {
    name: '日期',
    code: 'date',
  },
  {
    name: '图片与视频',
    code: 'image-video',
  },
  {
    name: '文件',
    code: 'file',
  },
  {
    name: '链接',
    code: 'link',
  },
  {
    name: '音乐与音频',
    code: 'sound',
  },
];
const keyword = ref('搜索');
</script>
<style lang="scss" scoped>
:deep(.uni-input-input),
:deep(.uni-input-placeholder),
.input {
  font-size: 32rpx;
}
</style>
