<template>
  <view class="qrcode-view" :style="viewStyle">
    <slot></slot>
    <canvas canvas-id="qrcode-canvas" class="qrcode-canvas" :style="canvasStyle" />
  </view>
</template>

<script setup>
import { ref, computed, watch, getCurrentInstance } from 'vue';
import UQRCode from '@/utils/uqrcode.js';

// --- Props and Emits ---
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 300,
  },
  margin: {
    type: Number,
    default: 10,
  },
  backgroundColor: {
    type: String,
    default: 'rgba(255,255,255,1)',
  },
  foregroundColor: {
    type: String,
    default: 'rgba(0,0,0,1)',
  },
  fileType: {
    type: String,
    default: 'png',
  },
});

const emit = defineEmits(['change', 'make']);

// --- Reactive State and Instance ---
const isMaking = ref(false);
const imageData = ref(null);
const instance = getCurrentInstance();

// --- Computed Properties ---
const viewStyle = computed(() => ({
  'background-image': imageData.value ? `url(${imageData.value})` : 'none',
  height: `${props.size}px`,
  width: `${props.size}px`,
}));

const canvasStyle = computed(() => ({
  height: `${props.size}px`,
  width: `${props.size}px`,
}));

// --- Methods ---
// *** 关键改动：将 make 函数定义移到 watch 之前 ***
// *** KEY CHANGE: Move the make function definition before the watch that uses it ***
const make = () => {
  isMaking.value = true;
  UQRCode.make({
    canvasId: 'qrcode-canvas',
    componentInstance: instance.proxy,
    text: props.text,
    size: props.size,
    margin: props.margin,
    backgroundColor: props.backgroundColor,
    foregroundColor: props.foregroundColor,
    fileType: props.fileType,
    errorCorrectLevel: UQRCode.errorCorrectLevel.H,
  })
    .then(data => {
      imageData.value = data;
      emit('make', {
        data,
        text: props.text,
        size: props.size,
        margin: props.margin,
        backgroundColor: props.backgroundColor,
        foregroundColor: props.foregroundColor,
        fileType: props.fileType,
        errorCorrectLevel: UQRCode.errorCorrectLevel.H,
      });
    })
    .catch(err => {
      console.error('UQRCode', err);
    })
    .finally(() => {
      isMaking.value = false;
    });
};

// --- Watchers ---
watch(
  () => props.text,
  newValue => {
    console.log('watch-text', newValue);
    if (newValue) {
      // 现在调用 make() 是安全的，因为它已经被定义了
      make();
    }
  },
  { immediate: true },
);

watch(isMaking, newValue => {
  console.log('watch-isMaking', newValue);
  emit('change', {
    isMaking: newValue,
  });
});

defineExpose({
  make,
  imageData,
  isMaking,
  viewStyle,
  canvasStyle,
});
</script>

<style scoped>
.qrcode-view {
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
  text-align: center;
}
#qrcode-canvas,
.qrcode-canvas {
  position: fixed;
  right: 100vw;
  bottom: 100vh;
  z-index: -9999;
  opacity: 0;
}
</style>
