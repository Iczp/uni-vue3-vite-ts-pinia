import { $emit, $once, navigateBack } from '@/commons/bridge';
import value from '@/uni_modules/vk-uview-ui/components/u-text/value';
import { navTo } from '@/utils/nav';
import { isHtml5Plus } from '@/utils/platform';
import { parseUrl } from '@/utils/shared';

export interface PickerParams {
  url?: string;
  multiple?: boolean;
  [keyof: string]: any;
}
export interface PickerResult {
  selectedItems?: Array<any>;
  success?: boolean;
  [keyof: string]: any;
}
export interface IdDto {
  id: string | number;
}

type PFN = (value: IdDto, item: IdDto) => boolean;
export const usePicker = () => {
  const selectedItems = ref<IdDto[]>([]);

  const disabledItems = ref<IdDto[]>([]);

  const isMultiple = ref(false);

  const max = ref(0);

  const isSelected = (item: IdDto, predicate: PFN = (x, v) => x.id == v.id) =>
    selectedItems.value.some(x => predicate(x, item));

  const isDisabled = (item: IdDto) => disabledItems.value.some(x => x.id === item.id);

  const onSelectItem = (item: IdDto) => {
    if (disabledItems.value.find(x => item.id === x.id)) {
      return;
    }
    selectedItems.value = [...selectedItems.value, item];
  };

  return { selectedItems, disabledItems, isMultiple, max, isSelected, isDisabled, onSelectItem };
};

export const openPicker = (url: string, params: PickerParams): Promise<PickerResult> =>
  new Promise((resolve, reject) => {
    const event = `picker-${new Date().getTime()}`;
    uni.$once(event, e => {
      console.log(`H5#event:${event}`, e);

      if (!isHtml5Plus) {
        resolve(e);
        // uni.showToast({ icon: 'none', title: `payload:${JSON.stringify(e)}` });
        return;
      }

      var obj = JSON.parse(e);
      const { event: removeEvent, args, action } = obj;
      const [localEvent, payload] = args;
      // uni.showToast({ icon: 'none', title: `payload:${JSON.stringify(payload)}` });
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

export const openObjectPicker = (params: PickerParams) =>
  openPicker('/pages/im/pickers/object-picker', params);

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
