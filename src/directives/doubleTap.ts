// v-double-tap.js
export default {
  mounted(el, binding) {
    let lastTouchTime = 0;
    el.addEventListener('touchstart', () => {
      // 可以在这里记录触摸开始的时间
    });
    el.addEventListener('touchend', event => {
      const currentTime = new Date().getTime();
      if (currentTime - lastTouchTime < 300) {
        console.log('double tap detected', binding);
        // 假设双击时间间隔为300毫秒
        binding.value?.(event); // 执行绑定的处理函数
      }
      lastTouchTime = currentTime;
    });

    // el.addEventListener('dbclick', event => {
    //   binding.value?.(event);
    // });
  },
};
