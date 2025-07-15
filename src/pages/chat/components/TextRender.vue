<script setup lang="ts">
import { computed } from 'vue';
import { formatWords, WordDto, setSelectedNode } from '@/utils/formatWords';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});
const emits = defineEmits<{
  // wordClick: [WordDto, Event?];
  (e: 'wordClick', item: WordDto, event?: Event): void;
}>();
const words = computed<WordDto[]>(() => formatWords(props.value!));
const onWordClick = (item: WordDto, event?: Event) => {
  // console.log('onWordClick', item, event);
  emits('wordClick', item, event);
};

const isObject = (item: WordDto): boolean => item.type != 'text';
</script>

<template>
  <div class="word">
    <!-- <div v-html="result"></div> -->
    <!-- {{ words }} -->
    <!-- {{ value }} -->
    <template v-for="(item, index) in words" :key="index">
      <template v-if="isObject(item)">
        <a
          class="link"
          :title="item.value"
          :type="item.type"
          :class="item.type"
          @click="onWordClick(item, $event)"
          @click.right.native="setSelectedNode"
        >
          {{ item.text }}
        </a>
      </template>
      <template v-else>
        {{ item.text }}
      </template>
    </template>
  </div>
</template>

<style scoped>
.word {
  word-wrap: break-word;
  word-break: break-all;
  white-space: break-spaces;
}
.link {
  /* color: var(--color); */
}
.link:hover {
  text-decoration: underline;
}
.uid {
  cursor: pointer;
  color: rgb(4, 154, 74);
}
.uid:hover {
  text-decoration: underline;
}
.oid {
  cursor: pointer;
  color: aquamarine;
}
.oid:hover {
  text-decoration: underline;
}
</style>
