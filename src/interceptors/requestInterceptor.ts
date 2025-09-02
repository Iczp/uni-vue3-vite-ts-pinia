import { getDeviceId } from '@/utils/deviceId';

export const _requestInterceptor = {
  invoke(args: { url: string; header: Record<string, string> }) {
    console.log('requestInterceptor', args);
    args.header['App-Device-Id'] = getDeviceId();
  },
};

export const requestInterceptor = {
  install() {
    uni.addInterceptor('request', _requestInterceptor);
  },
};
