import { appInit } from '@/commons/bridge/ready';
import { onLoad } from '@dcloudio/uni-app';

let isInitialized = false;
export const useBridge = () => {
  console.log('useBridge');

  console.log('app initialized', isInitialized);

  if (!isInitialized) {
    appInit();
    isInitialized = true;
  }

  onLoad(() => {
    console.log('Page loaded');
  });
};
