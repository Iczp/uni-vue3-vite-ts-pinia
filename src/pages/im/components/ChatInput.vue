<template>
  <div class="chat-input flex flex-col">
    <div class="flex flex-row items-center h-56 gap-8 px-8 text-16">
      <div class="btn-icon" @click="keyboardHideClick">
        <i class="i-ic:baseline-keyboard-hide"></i>
      </div>
      <div class="btn-icon" @click="keyboardHideClick">
        <i class="i-ic:baseline-contactless"></i>
      </div>

      <div class="input-wrapper flex flex-1">
        <!-- <u-search :placeholder="`搜索(`" :focus="false" :animation="false"></u-search> -->
        <div contenteditable="true">546465</div>
        <textarea
          v-model="inputText"
          class="input-textarea"
          :placeholder="placeholder"
          placeholder-class="input-placeholder"
          @focus="onFocus"
          @blur="onBlur"
          @input=""
        />
      </div>
      <div>{{ kbHeight }}/ {{ keyboardHeight }}</div>
      <div class="btn-icon" @click="faceClick">
        <i class="i-ic:baseline-face"></i>
      </div>
      <div class="btn-icon" @click="sendClick">
        <i class="i-ic:baseline-send"></i>
      </div>
      <!-- <div class="btn-icon">
        <i class="i-ic:round-plus"></i>
      </div> -->
    </div>
    <div class="keyboard-area flex flex-col" :style="keyboardAreaStyle">
      <div class="p-10">keyboardHeight: {{ keyboardHeight }}</div>
      <div class="p-10">kbHeight:{{ kbHeight }}</div>
      keyboard-height
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useKeyboard } from '@/hooks/useKeyboard';
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  maxlength: {
    type: Number,
    default: 100,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '请输入内容...',
  },
  defaultKeyboardHeight: {
    type: Number,
    default: 356,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const { keyboardHeight } = useKeyboard();

const inputText = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const isKeyboardAreaVisible = ref(false);
const keyboardAreaHeight = ref(0);
const kbHeight = ref(0);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    kbHeight.value = window?.visualViewport?.height || 0;
  });
}

const keyboardAreaStyle = reactive({
  height: `${0}px`,
  display: 'flex',
  transition: 'all 0.5s ease-in-out',
});

const onFocus = () => {
  // isKeyboardAreaVisible.value = false;
  // keyboardAreaStyle.height = `96rpx`;
  // keyboardAreaStyle.transition = 'all 0.3s ease-in-out';
  setTimeout(() => {}, 350);
  // keyboardAreaStyle.display = 'none';
};
const onBlur = () => {
  // keyboardAreaStyle.display = 'flex';
  // keyboardAreaStyle.height = `${keyboardHeight.value}px`;
};

const keyboardHideClick = () => {
  uni.hideKeyboard();
  keyboardAreaStyle.height = `0px`;
};
const faceClick = () => {
  console.log('face');
  keyboardAreaStyle.height = `356px`;
};
const sendClick = () => {
  console.log('send', inputText.value);
};
</script>
<style lang="scss" scoped>
.chat-input {
  // position: absolute;
  // position: sticky;
  // left: 0;
  // right: 0;
  // bottom: 0;
  z-index: 100;
  border-top: 1rpx solid #ddd;
  width: 100%;
  background-color: #aefece;
}
.keyboard-area {
  background-color: #feaeae;
  transition: all 0.35s;
}
.input-wrapper {
  position: relative;
  flex: 1;
  padding: 12rpx 24rpx;
  border-radius: 12rpx;
  background-color: #e8e8e8;
}
.input-textarea {
  width: 100%;
  height: 48rpx;
}
.btn-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  border: 1rpx solid #8e8e8e;
  border-radius: 50%;
  width: 72rpx;
  height: 72rpx;
  background-color: #fff;
  font-size: 40rpx;
  color: #000;
}
</style>
