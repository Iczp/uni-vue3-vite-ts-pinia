<script lang="ts" setup>
const props = defineProps({
  text: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
});
const emit = defineEmits(["click"]);
const onClick = () => {
  if (props.url) {
    uni.navigateTo({
      url: props.url,
    });
  } else {
    emit("click");
  }
};
</script>

<template>
  <div class="link-to" @click="onClick">
    <slot>{{ text }}</slot>
  </div>
</template>

<style lang="scss">
.link-to {
  display: flex;
}
</style>
