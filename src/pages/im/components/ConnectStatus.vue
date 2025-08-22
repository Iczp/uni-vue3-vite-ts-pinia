<template>
  <div
    v-if="isVisible"
    class="flex flex-center bg-gray-100 h-24 status"
    :status="status"
    @click="handleClick"
  >
    <span class="text-12">{{ statusText || '欢迎回来' }}</span>
  </div>
</template>

<script lang="ts" setup>
const status = ref();
const isVisible = ref(false);
const statuses = {
  connecting: '连接中...',
  connected: '已连接',
  reconnecting: '重连中...',
  reconnected: '已重连',
  close: '已断开',
  error: '连接失败',
};

// const timer = setInterval(() => {
//   setStatus(Object.keys(statuses).sort(() => Math.random() - 0.5)[0]);
// }, 5000);

const statusText = computed(() => {
  return statuses[status.value];
});
const handleClick = () => {
  console.log('点击了');
  status.value = 'connected';
};

const closeDelay = (timeout = 3000) => {
  setTimeout(() => {
    isVisible.value = false;
  }, timeout);
};

const setStatus = (s: string) => {
  status.value = s;
  isVisible.value = true;
  closeDelay();
};

uni.$on('connecting@signalr', () => {
  setStatus('connecting');
});
uni.$on('connected@signalr', () => {
  setStatus('connected');
});
uni.$on('close@signalr', () => {
  setStatus('connected');
});
uni.$on('reconnected@signalr', () => {
  setStatus('reconnected');
});
uni.$on('reconnecting@signalr', () => {
  setStatus('reconnecting');
});
</script>
<style lang="scss" scoped>
.status {
  transition: all 0.3s ease-in-out;
}
[status='connecting'] {
  background-color: #fdba74;
  color: #885013;
}
[status='connected'] {
  background-color: #bffac9;
  color: rgb(5, 112, 10);
}
[status='reconnecting'] {
  background-color: #f874fd;
  color: #6b096f;
}
[status='reconnected'] {
  background-color: #74ddfd;
  color: #1342e9;
}
</style>
