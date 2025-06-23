import { appInit } from '@/commons/bridge/ready';
import { onLoad } from '@dcloudio/uni-app';

let isInitialized = false;
export const useBridge = () => {
  const app = getApp();

  console.log('app initialized', app, isInitialized);

  if (!isInitialized) {
    appInit();
    isInitialized = true;
  }

  onLoad(() => {
    console.log('Page loaded');
  });
  return app;
};
