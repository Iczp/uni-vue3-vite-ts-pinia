import { getDeviceId } from '@/utils/deviceId';

export const _requestInterceptor = {
  async invoke(args: { url: string; header: Record<string, string> }) {
    console.log('requestInterceptor', args);
    args.header['App-Device-Id'] = await getDeviceId();
    return args;
  },
};

export const requestInterceptor = {
  install() {
    uni.addInterceptor('request', _requestInterceptor);
  },
};
