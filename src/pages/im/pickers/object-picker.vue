<template>
  <div class="flex flex-center flex-col flex-1 h-full w-full">
    {{ req }}
    <u-button type="primary" @click="onClick">invoke</u-button>
  </div>
</template>
<script lang="ts" setup>
import { invoke } from '@/hooks/usePicker';

const props = defineProps({
  event: {
    type: String,
    default: '',
  },
});

const req = ref();
onLoad(e => {
  console.log('onLoad', e);
  req.value = JSON.stringify(e);
});

const onClick = () => {
  invoke({
    event: props.event,
    payload: {
      id: 1,
      name: '张三',
    },
  });
};
</script>
<style lang="scss" scoped></style>
