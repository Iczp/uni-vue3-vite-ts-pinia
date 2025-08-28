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
      str.push(`${p}=${!isEmpty(value) ? encodeURIComponent(value as string) : ''}`);
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

export const navTo = (params: {
  url: string;
  query?: { [key: string]: any };
  redirect?: boolean;
  options?: {
    animationType?: AnimationType;
    [key: string]: any;
  };
}) => {
  const { url, query, options } = params;

  if (isHtml5Plus) {
    return navToWebview(
      toUrl(url, query),
      {},
      {
        animationType: options?.animationType || 'pop-in',
      },
    );
  }
  const goto = params.redirect ? uni.redirectTo : uni.navigateTo;
  goto({
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

export const navToChat = (args: { id: string; title?: string | null; [key: string]: any }) => {
  var url = toUrl('/pages/im/sessions/session', args);
  return navToWebview(
    url,
    { title: args?.title || '' },
    {
      // animationType: "pop-in",
    },
  );
};

export const navToSetting = (args: { [key: string]: any }) => {
  var url = toUrl('/pages/im/sessions/setting', args);

  console.log('isHtml5Plus', isHtml5Plus);
  return navToWebview(
    url,
    { title: args?.title || '聊天设置' },
    {
      // animationType: "pop-in",
    },
  );
};
