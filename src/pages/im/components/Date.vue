<template>
  <span>{{ formatValue }}</span>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // import locale
dayjs.locale('zh-cn');
const props = defineProps({
  value: {
    type: [Number, String, null],
    default: null,
  },
  icon: {
    type: String,
  },

  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
  },
  empty: {
    type: String,
    default: '-',
  },
});

const formatValue = computed(() => {
  if (props.format && props.value !== undefined && props.value !== null) {
    return dayjs(props.value).format(props.format);
  }
  return props.value || props.empty;
});
</script>
<style lang="scss" scoped></style>
