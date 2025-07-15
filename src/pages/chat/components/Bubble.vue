<script setup lang="ts">
import { CSSProperties } from 'vue';

const props = defineProps<{
  value?: string;
  // reverse
  r?: boolean;
  style?: CSSProperties;
}>();
</script>

<template>
  <div class="bubble" :style="style" :class="r ? 'right' : 'left'">
    <slot></slot>
    <!-- <footer class="bubble-footer">123</footer> -->
  </div>
</template>

<style lang="scss" scoped>
/* https://freefrontend.com/css-speech-bubbles/ */
.bubble {
  --r: 10px; /* the radius */
  --t: 12px; /* the size of the tail */
  display: inline-block;
  position: relative;
  /* max-width: 300px; */
  /* padding: calc(2 * var(--r) / 3) calc(2 * var(--r) / 3 + 8px); */
  // padding: 0;
  background: linear-gradient(135deg, rgba(14, 55, 205, 0.3), rgba(1, 156, 148, 0.3)) border-box;
  mask: radial-gradient(var(--t) at var(--_d) 0, #0000 98%, #000 102%) var(--_d) 6px /
    calc(100% - var(--r)) var(--t) no-repeat,
    conic-gradient(at var(--r) var(--r), #000 75%, #0000 0) calc(var(--r) / -2) calc(var(--r) / -2)
    padding-box,
    radial-gradient(50% 50%, #000 98%, #0000 102%) 0 0 / var(--r) var(--r) space padding-box;
  /* -webkit-mask: radial-gradient(var(--t) at var(--_d) 0, #0000 98%, #000 102%) var(--_d) 100% /
      calc(100% - var(--r)) var(--t) no-repeat,
    conic-gradient(at var(--r) var(--r), #000 75%, #0000 0) calc(var(--r) / -2) calc(var(--r) / -2)
      padding-box,
    radial-gradient(50% 50%, #000 98%, #0000 101%) 0 0 / var(--r) var(--r) space padding-box;
  background: linear-gradient(135deg, #fe6d00, #1384c5) border-box; */
  color: #000;
}
.bubble:hover {
  /* color: #ffffff; */
  background: linear-gradient(135deg, rgba(14, 55, 205, 0.4), rgba(1, 156, 148, 0.4)) border-box;
}
.left {
  --_d: 0%;
  margin-right: var(--t);
  border-left: var(--t) solid #0000;
  place-self: start;
}
.right {
  --_d: 100%;
  margin-left: var(--t);
  border-right: var(--t) solid #0000;
  background: linear-gradient(135deg, rgba(1, 156, 148, 0.3), rgba(14, 55, 205, 0.3)) border-box;
  place-self: end;
}
/* .bubble-footer {
  position: relative;
  width: 100%;
  border-top: 1px solid #0000;
}
.bubble-footer::after {
  content: '';
  height: 1px;
  left: 72px;
  right: 0px;
  bottom: 0;
  position: absolute;
  transform: scaleY(0.5);
  overflow: hidden;
  background-color: rgb(0, 0, 0);
  width: 100%;
} */
</style>
