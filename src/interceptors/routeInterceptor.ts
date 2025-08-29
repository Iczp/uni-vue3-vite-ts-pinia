import { navToWebview } from '@/commons/bridge';
import { toUrl } from '@/utils/nav';
import { isHtml5Plus } from '@/utils/platform';

import { getLastPage, parseUrl } from '@/utils/shared';

// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
export const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  // 增加对相对路径的处理，BY 网友 @ideal
  async invoke(args: { url: string; query?: Record<string, string>; [key: string]: any }) {
    console.log('路由拦截器 context', args);

    if (args.url === undefined) {
      console.warn('路由拦截器 url undefined', args);
      return false;
    }

    if (args.skip) {
      console.log('路由拦截器 skip Interceptor', args);
      // uni.showToast({
      //   title: `路由拦截器 args.skip ${args.skip} ${args.url}`,
      //   icon: 'none',
      //   duration: 5000,
      // });
      return args; // 继续执行后续的路由跳转逻辑
    }

    const uri = parseUrl(args.url);

    console.log('路由拦截器 uri', uri);
    const lastPage = getLastPage();
    const sub = lastPage?.['sub'] || parseUrl(document.URL).query?.sub;
    if (!uri?.query?.sub && sub) {
      const newUrl = toUrl(uri.path, {
        ...uri.query,
        sub, // 透传 sub 参数
      });
      console.warn('路由拦截器 newUrl', newUrl);
      args.url = newUrl;
    }

    if (!isHtml5Plus) {
      return args; // 继续执行后续的路由跳转逻辑
    }
    console.log('Plus环境使用Webview打开', args.url);
    // uni.showToast({
    //   title: `路由拦截器 sbu:${sub} ${args.url}`,
    //   icon: 'none',
    //   duration: 2000,
    // });
    await navToWebview(
      toUrl(args.url, args.query || {}),
      {},
      {
        animationType: 'pop-in',
      },
    );
    // 阻止默认行为，不继续执行后续的路由跳转逻辑
    return false;
  },
};

export const routeInterceptor = {
  install() {
    uni.addInterceptor('navigateTo', navigateToInterceptor);
    uni.addInterceptor('reLaunch', navigateToInterceptor);
    uni.addInterceptor('redirectTo', navigateToInterceptor);
    uni.addInterceptor('switchTab', navigateToInterceptor);
  },
};
