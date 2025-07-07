// import { getSystemInfo } from './bridge'
// import { jsonParse } from './utils';

import { jsonParse } from '@/utils/object';
import { getAuth, getSystemInfo } from '.';
import { useAuth } from '@/store/auth';
import { useUser } from '@/store/user';

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
  getSystemInfo().then(res => {
    const sysInfo = res.result;
    setCssVar(sysInfo);
    uni.setStorageSync(storageKey, JSON.stringify(sysInfo));
    console.log('getSystemInfo', JSON.stringify(sysInfo));
  });
};

const runGetAuthInfo = (caller?: string) => {
  console.log('runGetAuthInfo', caller);
  getAuth().then(res => {
    console.log('getAuth', JSON.stringify(res));
    const { header, user } = res.result;
    const userStore = useUser();
    userStore.setUserInfo(user);
    const authStore = useAuth();
    if (!authStore.token || authStore.isExpired) {
      authStore.fetchToken(header);
      return;
    }
  });
};
export const appInit = () => {
  console.log('app-init');
  const storeValue = uni.getStorageSync(storageKey);
  console.log('app-init storeValue', storeValue);
  sysInfo = jsonParse(storeValue);
  console.log('app-init sysInfo', sysInfo);

  appReady(caller => {
    runGetSystemInfo(caller);
    runGetAuthInfo(caller);
  });

  if (sysInfo) {
    setCssVar(sysInfo);
    console.log('app-init', JSON.stringify(sysInfo));
    return;
  }
};

const appReady = (callback: (caller: string) => void | Promise<any>) => {
  console.log('-------------- appReady --------------');
  document.addEventListener('UniAppJSBridgeReady', () => callback('UniAppJSBridgeReady'));
  // 定义一个轮询函数来检查PlusReady状态
  const checkPlusReady = () => {
    if (isPlus()) {
      console.log('PlusReady');
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
