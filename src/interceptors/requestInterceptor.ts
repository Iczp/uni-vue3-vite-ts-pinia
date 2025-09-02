import { getDeviceId } from '@/utils/deviceId';
import {version} from '../../package.json'
export const _requestInterceptor = {
  async invoke(args: { url: string; header: Record<string, string> }) {
    console.log('requestInterceptor', args);
    args.header['App-Device-Id'] = await getDeviceId();
    args.header['App-Version'] = version;
    return args;
  },
};

export const requestInterceptor = {
  install() {
    uni.addInterceptor('request', _requestInterceptor);
  },
};
