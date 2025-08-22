import { useAuthStore } from '@/store/auth';
import { parseUrl } from '@/utils/shared';
const loginPageUrl = '/pages/account/login';
export const ignoredPages = [loginPageUrl];
export function useAuthPage() {
  const authStore = useAuthStore();

  const checkLogin = () => {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    console.log('useAuth page', page);
    const { fullPath } = page?.$vm.$page;
    console.log('useAuth authStore.isLogin', authStore.isLogin, fullPath);

    console.log('useAuth parseUrl', parseUrl(fullPath));

    console.log('useAuth ignoredPages', fullPath, ignoredPages.includes(fullPath));

    if (!authStore.isLogin && !ignoredPages.includes(fullPath)) {
      uni.redirectTo({
        url: loginPageUrl,
      });
    }
  };

  const isLogin = () => authStore.isLogin;

  onShow(e => {
    console.log('useAuth Page Show', e);
    checkLogin();
  });

  return {
    checkLogin,
    isLogin,
  };
}
