// import { getSystemInfo } from './bridge'
// import { jsonParse } from './utils';

import { jsonParse } from '@/utils/object';
import { getSystemInfo } from '.';

export const setCss = (property: string, value: string) => {
  document.documentElement.style.setProperty(property, value);
  console.log(`Set CSS variable: ${property} = ${value}`);
};

let sysInfo: Object | null = {};

export const setCssVar = (sysInfo: { [key: string]: any }) => {
  console.log('sysInfo.safeArea', sysInfo);
  setCss('--status-bar-height', `${sysInfo.statusBarHeight}px`);

  const safeArea = sysInfo.safeArea;

  const insets = sysInfo.safeAreaInsets;

  console.log('safeArea', safeArea);

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

export const appInit = () => {
  const storeValue = uni.getStorageSync('app-info');
  sysInfo = jsonParse(storeValue);
  if (sysInfo) {
    setCssVar(sysInfo);
    console.log('app-init', JSON.stringify(sysInfo));
    return;
  }

  document.addEventListener('UniAppJSBridgeReady', () => {
    console.log('UniAppJSBridgeReady');
    alert('UniAppJSBridgeReady');
    getSystemInfo().then(res => {
      const sysInfo = res.result;
      setCssVar(sysInfo);
      uni.setStorageSync('app-info', JSON.stringify(sysInfo));
      console.log('getSystemInfo', JSON.stringify(sysInfo));
    });
  });

};
