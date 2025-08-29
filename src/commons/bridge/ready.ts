// import { getSystemInfo } from './bridge'
// import { jsonParse } from './utils';

import { jsonParse } from '@/utils/object';
import { getAuth, getSystemInfo } from '.';
import { useAuthStore } from '@/store/auth';
import { isHtml5Plus } from '@/utils/platform';

let isInitialized = false;
export const useBridge = () => {
  console.log('useBridge');
  if (!isHtml5Plus) {
    console.warn('非Plus环境，跳过桥接初始化');
    return;
  }
  console.log('app initialized', isInitialized);

  if (!isInitialized) {
    appInit();
    isInitialized = true;
  }
};

export const setCss = (property: string, value: string) => {
  document.documentElement.style.setProperty(property, value);
  // console.log(`Set CSS variable: ${property} = ${value}`);
};

let sysInfo: Object | null = {};

export const setCssVar = (sysInfo: { [key: string]: any }) => {
  console.log('sysInfo.safeArea', sysInfo);
  setCss('--status-bar-height', `${sysInfo.statusBarHeight}px`);

  const safeArea = sysInfo.safeArea;

  const insets = sysInfo.safeAreaInsets;

  // console.log('safeArea', safeArea);

  setCss('--status-bar-height', `${safeArea?.top}px`);

  setCss('--app-safe-area-top', `${safeArea?.top}px`);
  setCss('--app-safe-area-left', `${safeArea?.left}px`);
  setCss('--app-safe-area-right', `${safeArea?.right}px`);
  setCss('--app-safe-area-bottom', `${safeArea?.bottom}px`);
  setCss('--app-safe-area-width', `${safeArea?.width}px`);
  setCss('--app-safe-area-height', `${safeArea?.height}px`);

  setCss('--app-safe-area-insets-top', `${insets?.top}px`);
  setCss('--app-safe-area-insets-left', `${insets?.left}px`);
  setCss('--app-safe-area-insets-right', `${insets?.right}px`);
  setCss('--app-safe-area-insets-bottom', `${insets?.bottom}px`);
};

export const getSystemInfoStore = () => {};

export const isPlus = () => {
  return !!window['plus'];
};

const storageKey = 'app-info-v1';

const runGetSystemInfo = (caller?: string) => {
  console.log('runGetSystemInfo', caller);
  getSystemInfo()
    .then(res => {
      const sysInfo = res.result;
      setCssVar(sysInfo);
      uni.setStorageSync(storageKey, JSON.stringify(sysInfo));
      console.log('getSystemInfo', JSON.stringify(sysInfo));
    })
    .catch(err => {
      console.error('getSystemInfo error', err);
    });
};

export const loginByApp = (caller?: string) => {
  console.log('runGetAuthInfo', caller);
  const authStore = useAuthStore();
  if (authStore.token && !authStore.isExpired) {
    console.log('已有有效Token，跳过登录');
    uni.showToast({ title: '欢迎回来', icon: 'none' });
    return;
  }
  uni.showLoading({ title: '登录中...', mask: true });
  jsBridgeReady()
    .then(() => {
      getAuth()
        .then(async res => {
          console.log('getAuth', JSON.stringify(res));
          const { header, user } = res.result;
          await authStore.loginErp(header);
          uni.showToast({ title: '登录成功', icon: 'success' });
        })
        .catch(err => {
          console.error('getAuth error', err);
          uni.showToast({ icon: 'none', title: '登录失败' });
        });
    })
    .catch(err => {
      console.error('jsBridgeReady error', err);
    })
    .finally(() => {
      uni.hideLoading();
    });
};
export const appInit = () => {
  console.log('------------app-init isHtml5Plus-------------', isHtml5Plus);

  // 订阅SignalR事件
  subscriptionSignalrEvents();

  const storeValue = uni.getStorageSync(storageKey);
  console.log('app-init storeValue', storeValue);
  sysInfo = jsonParse(storeValue);
  console.log('app-init sysInfo', sysInfo);

  //login ...

  jsBridgeReady()
    .then(caller => {
      console.log('jsBridgeReady ok', caller);
      runGetSystemInfo(caller);
      // loginByApp(caller);
    })
    .catch(err => {
      console.error('jsBridgeReady error', err);
    });

  // bridgeReady(caller => {
  //   runGetSystemInfo(caller);
  //   runGetAuthInfo(caller);
  // });

  if (sysInfo) {
    setCssVar(sysInfo);
    console.log('app-init', JSON.stringify(sysInfo));
    return;
  }
};

export function jsBridgeReady(args?: { timeout: number }): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isHtml5Plus) {
      reject('非Plus环境');
      return;
    }
    console.log('-------------- jsBridgeReady --------------');
    // 定义一个用于处理UniAppJSBridgeReady事件的函数
    const handleUniAppJSBridgeReady = () => {
      console.log('UniAppJSBridgeReady event triggered');
      resolve('UniAppJSBridgeReady');
    };

    // 定义一个轮询函数来检查PlusReady状态
    const checkPlusReady = () => {
      if (isPlus()) {
        console.log('===================PlusReady===================');
        resolve('checkPlusReady');
        clearInterval(pollInterval); // 停止轮询
      }
    };

    // 设置一个轮询间隔（例如每50毫秒检查一次）
    const pollInterval = setInterval(checkPlusReady, 50);

    // 设置一个超时机制，在30秒后如果没有返回结果则拒绝Promise
    const timeoutId = setTimeout(() => {
      clearInterval(pollInterval); // 停止轮询
      reject(new Error('Operation timed out'));
    }, args?.timeout || 30000);

    // 定义一个函数来清除轮询间隔和超时定时器
    const clearResources = () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
    // 监听UniAppJSBridgeReady事件
    document.addEventListener('UniAppJSBridgeReady', handleUniAppJSBridgeReady, { once: true });
    // 在UniAppJSBridgeReady事件触发时，也清除轮询间隔和超时定时器，以防重复执行
    document.addEventListener('UniAppJSBridgeReady', clearResources, { once: true });
  });
}

export const bridgeReady = (callback: (caller: string) => void | Promise<any>) => {
  console.log('-------------- bridgeReady --------------');
  document.addEventListener('UniAppJSBridgeReady', () => callback('UniAppJSBridgeReady'));
  // 定义一个轮询函数来检查PlusReady状态
  const checkPlusReady = () => {
    if (isPlus()) {
      console.log('===================PlusReady===================');
      // 如果PlusReady状态满足，同样获取系统信息并设置CSS变量
      callback('checkPlusReady');
      // 停止轮询
      clearPollInterval();
    }
  };
  // 设置一个轮询间隔（例如每500毫秒检查一次）
  const pollInterval = setInterval(checkPlusReady, 50);

  const clearPollInterval = () => {
    clearInterval(pollInterval);
  };
  // 在 UniAppJSBridgeReady 事件触发时也清除轮询间隔，以防重复执行
  document.addEventListener('UniAppJSBridgeReady', clearPollInterval, { once: true });
};

export const subscriptionSignalrEvents = () => {
  if (!isHtml5Plus) {
    return;
  }
  const events = 'connecting,connected,reconnected,reconnecting,close,received'
    .split(',')
    .map(x => `${x}@signalr`);

  events.forEach(event => {
    console.log(`uni.$on: ${event}`);
    uni.$on(event, (...args) => {
      console.log(`#--H5--# Event: ${event}`, ...args);
    });
  });
};
