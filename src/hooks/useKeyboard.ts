// src/hooks/useKeyboard.ts

import { ref, computed, onMounted, onUnmounted, readonly } from 'vue';

/**
 * 侦测移动端键盘高度、可见性以及屏幕方向的 Vue Composition API Hook。
 *
 * @returns {object}
 * @property {Readonly<Ref<number>>} keyboardHeight - 响应式的键盘实时高度 (px)。
 * @property {Readonly<Ref<boolean>>} isKeyboardVisible - 响应式的键盘可见性状态。
 * @property {Readonly<Ref<boolean>>} isLandscape - 响应式的屏幕方向状态，true 为横屏，false 为竖屏。
 *
 * @example
 * <script setup>
 * import { useKeyboard } from './hooks/useKeyboard';
 *
 * const { keyboardHeight, isKeyboardVisible, isLandscape } = useKeyboard();
 * </script>
 */
export const useKeyboard = () => {
  const isClient = typeof window !== 'undefined';

  const keyboardHeight = ref(0);
  const isKeyboardVisible = computed(() => keyboardHeight.value > 0);

  // 用于存储屏幕方向的状态
  const isLandscape = ref(false);

  let initialViewportHeight = 0;
  const KEYBOARD_THRESHOLD = 100;

  // 将媒体查询对象存在这里，方便在 onUnmounted 中移除监听器
  let mediaQuery: MediaQueryList | null = null;

  const updateKeyboardHeight = () => {
    if (!isClient || !window.visualViewport) return;

    const currentViewportHeight = window.visualViewport.height;
    const heightDifference = initialViewportHeight - currentViewportHeight;

    if (heightDifference > KEYBOARD_THRESHOLD) {
      keyboardHeight.value = heightDifference;
    } else {
      keyboardHeight.value = 0;
    }
  };

  const handleResize = () => {
    updateKeyboardHeight();
  };

  /**
   * 当屏幕方向变化时触发。
   * 这个事件处理器现在有两个职责：
   * 1. 更新 isLandscape 状态。
   * 2. 重置用于计算键盘高度的基准视口高度。
   */
  const handleOrientationChange = () => {
    if (!isClient || !mediaQuery) return;

    // 1. 更新 isLandscape 状态
    isLandscape.value = mediaQuery.matches;

    // 2. 重置基准高度
    // 使用 setTimeout 等待浏览器完成旋转和重绘
    setTimeout(() => {
      if (!window.visualViewport) return;
      initialViewportHeight = window.visualViewport.height;
      // 方向改变后，键盘通常会收起，重置高度
      keyboardHeight.value = 0;
    }, 300);
  };

  onMounted(() => {
    if (!isClient) return;

    // --- 键盘高度监听 ---
    if (window.visualViewport) {
      initialViewportHeight = window.visualViewport.height;
      window.visualViewport.addEventListener('resize', handleResize);
    } else {
      initialViewportHeight = window.innerHeight;
      window.addEventListener('resize', handleResize);
    }

    // --- 屏幕方向监听 (使用 matchMedia) ---
    mediaQuery = window.matchMedia('(orientation: landscape)');
    // 设置初始状态
    isLandscape.value = mediaQuery.matches;
    // 添加事件监听器
    mediaQuery.addEventListener('change', handleOrientationChange);
  });

  onUnmounted(() => {
    if (!isClient) return;

    // 清理键盘监听
    if (window.visualViewport) {
      window.visualViewport.removeEventListener('resize', handleResize);
    } else {
      window.removeEventListener('resize', handleResize);
    }

    // 清理方向监听
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handleOrientationChange);
    }
  });

  return {
    keyboardHeight: readonly(keyboardHeight),
    isKeyboardVisible: readonly(isKeyboardVisible),
    isLandscape: readonly(isLandscape), // 返回的状态
  };
};
