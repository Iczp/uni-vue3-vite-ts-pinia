<template>
  <z-paging ref="pagingRef">
    <template #top>
      <AppNavBar :title="''" :isBack="true" :isMore="false" :border="false"></AppNavBar>
    </template>
    <div ref="divRef" class="flex flex-col flex-center gap-12 mt-24 p-12" @click="handleSave">
      <div>
        <Avatar :size="56" />
      </div>
      <div class="font-bold text-16">群聊:{{ name }}</div>
      <QrCode :text="qrText"></QrCode>
      <div class="text-12">
        {{ qrText }}
      </div>
      <div class="text-gray text-12">该二维码7天(8月12日)内有效,重新进入将更新</div>
    </div>

    <div class="flex flex-col mt-36">
      <u-button type="primary" @click="handleSave">保存</u-button>
    </div>
  </z-paging>
</template>
<script lang="ts" setup>
import html2canvas from 'html2canvas';
import QrCode from '@/pages/im/components/QrCode.vue';
import Avatar from '@/pages/im/components/Avatar.vue';

import { CHAT_BASE_URL } from '@/config/env';
const pagingRef = ref();
const props = defineProps({
  id: {
    type: String,
    default: '',
  },
});

const divRef = ref<HTMLDivElement | undefined>();

const name = ref('555');

const qrText = ref(`${CHAT_BASE_URL}/qr/g?id=${props.id}`);

const handleSave = () => {
  console.log(divRef.value);
  uni.showLoading({ title: '保存中...' });
  html2canvas(divRef.value!)
    .then(canvas => {
      console.log('canvas', canvas);
      const img = canvas.toDataURL('image/png');
      console.log('img', img);
      document.body.appendChild(canvas);
      uni.showToast({ title: '保存成功', icon: 'none' });
    })
    .catch(err => {
      uni.showToast({ title: '保存失败', icon: 'none' });
    })
    .finally(() => {
      uni.hideLoading();
    });
};
</script>
<style lang="scss" scoped>
:deep(.uni-input-input),
:deep(.uni-input-placeholder),
.input {
  font-size: 32rpx;
}
</style>
