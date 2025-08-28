import { toUrl } from '@/utils/nav';

import { getLastPage, parseUrl } from '@/utils/shared';


// 黑名单登录拦截器 - （适用于大部分页面不需要登录，少部分页面需要登录）
export const navigateToInterceptor = {
  // 注意，这里的url是 '/' 开头的，如 '/pages/index/index'，跟 'pages.json' 里面的 path 不同
  // 增加对相对路径的处理，BY 网友 @ideal
  invoke(args: { url: string; query?: Record<string, string> }) {
    console.log('路由拦截器 context', args);
    const { url } = args;
    if (url === undefined) {
      return;
    }
    const uri = parseUrl(url);

    console.log('路由拦截器 uri', uri);

    const lastPage = getLastPage();
    const sub = lastPage?.['sub'];
    console.log('路由拦截器 lastPage sub', sub, lastPage);

    if (!uri?.query?.sub && sub) {
      const newUrl = toUrl(uri.path, {
        ...uri.query,
        sub, // 透传 sub 参数
      });
      console.warn('路由拦截器 newUrl', newUrl);
      args.url = newUrl;
    }
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
