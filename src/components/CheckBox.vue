<template>
  <div
    class="check-box text-gray"
    :checked="checked"
    :disabled="disabled"
    :class="icon"
    @click="change"
  >
    <slot></slot>
  </div>
</template>
<!-- <script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    isChecked: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: [Boolean],
      required: false,
    },
  },
  emits: ['update:isChecked'],
  computed: {
    icon() {
      if (this.isChecked === true) {
        return 'i-ic:round-check-box';
      }
      if (this.isChecked === false) {
        return 'i-ic:round-check-box-outline-blank';
      } else {
        return 'i-ic:round-indeterminate-check-box';
      }
    },
  },
  data() {
    return {
      checked: this.isChecked,
    };
  },
  setup(props, { emit }) {
    const isChecked = ref(props.isChecked);
    const handleChange = () => {
      emit('update:isChecked', !props.isChecked);
    };

    const handleClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).tagName !== 'INPUT') {
        handleChange();
      }
    };

    return {
      isChecked,
      handleChange,
      handleClick,
    };
  },
  methods: {
    change() {
      if (this.disabled) return;
      this.checked = !this.checked;
      console.log('change', this.checked);
      this.$emit('update:isChecked', !this.isChecked);
    },
  },
  components: {},
});
</script> -->

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: [Boolean, null],
    default: false,
    required: false,
  },
  // value: {
  //   type: Boolean,
  //   default: false,
  // },
  checked: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: [Boolean],
    required: false,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const isChecked = ref(props.modelValue);

watch(
  () => props.checked,
  (val) => {
    isChecked.value = val;
  },
);

const change = () => {
  if (props.disabled) return;
  // isChecked.value =!isChecked.value;
  emit('change', !props.modelValue);
  emit('update:modelValue', !props.modelValue);
};

const icon = computed(() => {
  if (props.checked === true) {
    return 'i-ic:round-check-box';
  }
  if (props.checked === false) {
    return 'i-ic:round-check-box-outline-blank';
  } else {
    return 'i-ic:round-indeterminate-check-box';
  }
});
</script>

<style lang="scss">
:where(.check-box) {
  font-size: 44rpx;
  color: rgb(81, 81, 81);
}
.check-box[checked='true'] {
  color: rgb(23, 110, 210);
}
.check-box[disabled='true'] {
  color: rgb(227, 227, 227) !important;
}
</style>
