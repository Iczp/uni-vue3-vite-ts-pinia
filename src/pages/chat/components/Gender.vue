<template>
  <i :class="[iconClass, `gender-${gender}`]"></i>
</template>
<script lang="ts" setup>
const props = defineProps({
  gender: {
    type: Number,
    default: 0,
  },
});

const iconClass = computed(() => {
  switch (props.gender) {
    case 1:
      return `i-ic:round-person-4`;
    case 2:
      return `i-ic:round-person-2`;
    default:
    case 0:
      return `i-ic:round-person`;
  }
});
</script>
<style lang="scss" scoped>
.gender-0 {
  background-color: rgb(202, 202, 202);
}
.gender-1 {
  background-color: rgb(50, 187, 251);
}
.gender-2 {
  background-color: rgb(249, 151, 136);
}
</style>
