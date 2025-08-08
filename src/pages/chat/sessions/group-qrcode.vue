<template>
  <z-paging ref="pagingRef">
    <template #top>
      <AppNavBar :title="''" :isBack="true" :isMore="false" :border="true"></AppNavBar>
    </template>
    <div class="flex flex-col flex-center gap-12 mt-36">
      <div>
        <Avatar />
      </div>

      <QrCode :text="qrText"></QrCode>
      <div>
        {{ qrText }}
      </div>
    </div>
  </z-paging>
</template>
<script lang="ts" setup>
import QrCode from '@/pages/chat/components/QrCode.vue';
import Avatar from '@/pages/chat/components/Avatar.vue';
const pagingRef = ref();
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const name = ref('555');

const qrText = ref(`https://www.baidu.com?id=${props.id}`);
</script>
<style lang="scss" scoped>
:deep(.uni-input-input),
:deep(.uni-input-placeholder),
.input {
  font-size: 32rpx;
}
</style>
