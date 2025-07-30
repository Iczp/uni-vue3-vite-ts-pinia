import type { AnimationType } from '@/@types/uni';
import { navToWebview } from '@/commons/bridge';
import { isH5, isHtml5Plus } from './platform';

export const isEmpty = (v: any) => !v && v != 0;

export const toQueryString = (obj: Object) => {
  const str: string[] = [];
  // console.log('p', p,obj[p],obj.hasOwnProperty(p))
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      let value = obj[p];
      console.log('value', value, isEmpty(value));
      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }
      str.push(
        `${encodeURIComponent(p)}=${!isEmpty(value) ? encodeURIComponent(value as string) : ''}`,
      );
    }
  return str.join('&');
};

export const toUrl = (uri: string, obj: any) => {
  // console.log('toUrl', uri, obj)
  if (!obj) {
    return uri;
  }
  const and = uri.includes('?') ? '&' : '?';
  const url = uri + and + toQueryString(obj);
  // console.log('toUrl', url)
  return url;
};

export const navTo = (
  uri: string,
  obj?: any,
  opts: { animationType?: AnimationType } = { animationType: 'pop-in' },
) =>
  uni.navigateTo({
    url: toUrl(uri, obj),
    animationType: opts.animationType,
    fail(err) {
      console.error(err);
    },
  });

  //
export const goto = (params: {
  url: string;
  query: { [key: string]: any };
  options?: {
    animationType?: AnimationType;
    [key: string]: any;
  };
}) => {
  const { url, query, options } = params;

  if (!isHtml5Plus) {
  }
  uni.navigateTo({
    url: toUrl(url, query),
    animationType: options?.animationType || 'pop-in',
    fail(err) {
      console.error(err);
    },
  });
};

export const redirectTo = (uri: string, obj: any) =>
  uni.redirectTo({
    url: toUrl(uri, obj),
    fail(err) {
      console.error(err);
    },
  });

export const jsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

export const navToChat = (args: { [key: string]: any }) => {
  var url = toUrl('/pages/chat/session', args);
  return navToWebview(
    url,
    { title: args?.title || '' },
    {
      // animationType: "pop-in",
    },
  );
};

export const navToSetting = (args: { [key: string]: any }) => {
  var url = toUrl('/pages/chat/setting', args);

  console.log('isHtml5Plus', isHtml5Plus);
  return navToWebview(
    url,
    { title: args?.title || '聊天设置' },
    {
      // animationType: "pop-in",
    },
  );
};
