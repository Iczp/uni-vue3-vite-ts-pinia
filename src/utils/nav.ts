import type { AnimationType } from '@/@types/uni';

export const isEmpty = (v: any) => !v && v != 0;

export const toQueryString = (obj: Object) => {
  const str: string[] = [];
  // console.log('p', p,obj[p],obj.hasOwnProperty(p))
  for (const p in obj)
    if (obj.hasOwnProperty(p)) {
      let value = obj[p];
      // console.log('toQueryString', p, value, isEmpty(value));
      if (typeof value == 'object') {
        value = JSON.stringify(value);
      }
      const encodedValue = /[&?=]/.test(value) ? encodeURIComponent(value as string) : value;
      str.push(`${p}=${!isEmpty(value) ? encodedValue : ''}`);
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
  //使用webview打开
  webview?: boolean;
  options?: {
    animationType?: AnimationType;
    [key: string]: any;
  };
}) => {
  console.log('navTo', params);
  const url = toUrl(params.url, params.query);
  console.log('navTo url', url);

  // if (isHtml5Plus) {
  //   return navToWebview(
  //     toUrl(url, query),
  //     {},
  //     {
  //       animationType: options?.animationType || 'pop-in',
  //     },
  //   );
  // }
  const goto = params.redirect ? uni.redirectTo : uni.navigateTo;
  goto({
    url,
    webview: params?.webview,
    animationType: params?.options?.animationType || 'pop-in',
    fail(err) {
      console.error('goto', err);
    },
  });
};

// export const redirectTo = (uri: string, obj: any) =>
//   uni.redirectTo({
//     url: toUrl(uri, obj),
//     fail(err) {
//       console.error(err);
//     },
//   });

// export const jsonParse = (json: string) => {
//   try {
//     return JSON.parse(json);
//   } catch (err) {
//     return null;
//   }
// };

export const navToChat = (args: { id: string; title?: string | null; [key: string]: any }) =>
  navTo({ url: `/pages/im/sessions/session`, query: { ...args } });

export const navToChatSetting = (args: { [key: string]: any }) =>
  navTo({ url: `/pages/im/sessions/setting`, query: { ...args } });
