import { $emit, $once, navigateBack } from '@/commons/bridge';
import { navTo } from '@/utils/nav';
import { isHtml5Plus } from '@/utils/platform';
import { parseUrl } from '@/utils/shared';

export interface PickerParams {
  url: string;
  multiple?: boolean;
}
export const usePicker = (url, params: PickerParams) =>
  new Promise((resolve, reject) => {
    const event = `picker-${new Date().getTime()}`;
    uni.$once(event, e => {
      console.log(`H5#event:${event}`, e);

      if (!isHtml5Plus) {
        resolve(e);
        uni.showToast({ icon: 'none', title: `payload:${JSON.stringify(e)}` });
        return;
      }

      var obj = JSON.parse(e);
      const { event: removeEvent, args, action } = obj;
      const [localEvent, payload] = args;
      uni.showToast({ icon: 'none', title: `payload:${JSON.stringify(payload)}` });
      resolve(payload);
    });

    const gotoPicker = () =>
      navTo({
        url, //: '/pages/im/pickers/object-picker',
        query: {
          ...params,
          event,
        },
        options: { animationType: 'pop-in' },
      });

    if (isHtml5Plus) {
      $once(event)
        .then(res => {
          console.log(`$on:5566-${event}`, res);
          gotoPicker();
        })
        .catch(err => {
          console.log('picker err:', JSON.stringify(err));
          reject(err);
        });
    } else {
      gotoPicker();
    }
  });

export const useObjectPicker = (params: PickerParams) =>
  usePicker('/pages/im/pickers/object-picker', params);

export const invoke = ({ event, payload }: { event: string; payload: any }) => {
  if (!event) {
    const message = `未设置'event'参数`;
    uni.showToast({ icon: 'none', title: message });
    return Promise.reject({ message });
  }
  if (!isHtml5Plus) {
    uni.$emit(event, payload);
    uni.navigateBack();
    return Promise.resolve({ message: 'ok' });
  }
  var task = $emit(event, payload);
  navigateBack().finally(() => {
    // uni.navigateBack();
  });
  return task;
};
