// src/directives/ripple.js

const ripple = {
  // 指令绑定到元素后调用
  mounted(el, binding) {
    // 为目标元素设置必要的样式
    const style = getComputedStyle(el);
    if (style.position === 'static') {
      el.style.position = 'relative';
    }
    el.style.overflow = 'hidden';

    // 创建点击事件处理函数
    const handler = (event) => {
      // 1. 创建一个波纹元素 (span)
      const rippleEl = document.createElement('span');
      rippleEl.className = 'ripple'; // 添加 class 以便应用样式

      // 2. 计算波纹的位置
      // getBoundingClientRect() 返回元素的大小及其相对于视口的位置
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // 3. 计算波纹的最大尺寸，确保能覆盖整个元素
      const size = Math.max(el.clientWidth, el.clientHeight);
      const radius = size;

      // 4. 设置波纹元素的样式
      Object.assign(rippleEl.style, {
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        left: `${x - radius}px`, // 将波纹中心对准点击位置
        top: `${y - radius}px`,
        position: 'absolute',
        borderRadius: '50%',
        backgroundColor: binding.value || 'rgba(255, 255, 255, 0.3)', // 允许自定义颜色
        transform: 'scale(0)',
        transition: 'transform 0.6s ease-out, opacity 0.6s ease-out',
        opacity: '1',
        pointerEvents: 'none', // 确保波纹不会干扰点击事件
      });

      // 5. 将波纹元素添加到目标元素中
      el.appendChild(rippleEl);
      
      // 6. 强制浏览器重绘，以确保动画能够从 scale(0) 开始
      // 这是一个小技巧，没有它，浏览器可能会将初始状态和最终状态合并，导致没有动画效果
      rippleEl.offsetWidth; 

      // 7. 应用动画的最终状态
      rippleEl.style.transform = 'scale(1)';
      rippleEl.style.opacity = '0';

      // 8. 动画结束后移除波纹元素
      setTimeout(() => {
        if (rippleEl.parentNode) {
          rippleEl.parentNode.removeChild(rippleEl);
        }
      }, 600); // 这里的延迟时间应与 CSS transition 时间一致
    };

    // 将事件处理器存储在元素上，以便在 unmounted 时移除
    el.__vRipple = { handler };

    // 监听 mousedown 事件（比 click 响应更快）
    el.addEventListener('mousedown', handler);
  },

  // 指令与元素解绑时调用
  beforeUnmount(el) {
    if (el.__vRipple && el.__vRipple.handler) {
      el.removeEventListener('mousedown', el.__vRipple.handler);
      delete el.__vRipple;
    }
  }
};

export default ripple;