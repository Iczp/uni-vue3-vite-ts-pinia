<template>
  <z-paging ref="pagingRef">
    <template #top>
      <AppNavBar :title="''" :isBack="true" :isMore="false" :border="true"></AppNavBar>
    </template>
    <div class="flex flex-col gap-12 flex-center mt-36">
      <div class="text-18 font-bold">修改群备注</div>
      <div class="flex text-14 text-gray">修改群名称后,将在群内通知其他成员</div>
      <div
        class="flex flex-row box-border items-center border-before border-after gap-12 mx-24 py-8"
      >
        <label for="name">名称:</label>
        <u-input
          id="name"
          placeholder="群名称"
          type="text"
          :clearable="true"
          :maxlength="100"
          v-model="name"
          :border="false"
          class="text-16 input"
        ></u-input>
      </div>
    </div>

    <template #bottom>
      <div>完成</div>
    </template>
  </z-paging>
</template>
<script lang="ts" setup>
const pagingRef = ref();

const name = ref('群备注');
</script>
<style lang="scss" scoped>
:deep(.uni-input-input),
:deep(.uni-input-placeholder),
.input {
  font-size: 32rpx;
}
</style>
