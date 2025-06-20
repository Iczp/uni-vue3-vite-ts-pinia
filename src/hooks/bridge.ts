import { onLoad } from '@dcloudio/uni-app';
export const useBridge = () => {
  const app = getApp();
  console.log('app initialized', app);

  onLoad(() => {
    console.log('Page loaded');
  });
  return app;
};
