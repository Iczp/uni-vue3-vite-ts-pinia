import { useAuthStore } from '@/store/auth';
import { navTo } from '@/utils/nav';
import { getLastPage, parseUrl } from '@/utils/shared';
const loginPageUrl = '/pages/account/login';
export const ignoredPages = [loginPageUrl];
export function useAuthPage() {
  const authStore = useAuthStore();

  const checkLogin = () => {
    try {
      console.log('useAuth checkLogin 3', authStore.isLogin);
      const lastPage = getLastPage() || null;

      if (!lastPage || !lastPage.$vm || !lastPage.$vm?.$page) {
        console.warn('Failed to retrieve page information');
        return;
      }

      const { fullPath, path } = lastPage?.$vm?.$page;

      console.log('useAuth authStore.isLogin', authStore.isLogin, path, fullPath);

      console.log('useAuth parseUrl', parseUrl(fullPath));

      console.log('useAuth ignoredPages', fullPath, ignoredPages.includes(fullPath));
      // return;

      const isToLogin = !authStore.isLogin && !ignoredPages.includes(path);

      // uni.showToast({
      //   title: `useAuth lastPage isToLogin ${isToLogin}`,
      //   icon: 'none',
      //   duration: 5000,
      // });

      if (isToLogin) {
        setTimeout(() => {
          navTo({
            url: loginPageUrl,
            query: { to: fullPath },
            redirect: true,
            webview: false, // 不使用webview打开
          });
        }, 0);
      }
    } catch (error) {
      console.error('useAuth checkLogin error', error);
    }
  };

  const isLogin = () => authStore.isLogin;

  onLoad(e => {
    console.log('useAuth Page Load', e);
    checkLogin();
  });

  onShow(e => {
    console.log('useAuth Page Show', e);
    // checkLogin();
  });

  return {
    checkLogin,
    isLogin,
  };
}
