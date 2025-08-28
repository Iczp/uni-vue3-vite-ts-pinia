import { useAuthStore } from '@/store/auth';
import { navTo } from '@/utils/nav';
import { getLastPage, parseUrl } from '@/utils/shared';
const loginPageUrl = '/pages/account/login';
export const ignoredPages = [loginPageUrl];
export function useAuthPage() {
  const authStore = useAuthStore();

  const checkLogin = () => {
    console.log('useAuth checkLogin', authStore.isLogin);
    const lastPage = getLastPage();
    console.log('useAuth page', lastPage);
    const { fullPath, path } = lastPage?.$vm.$page;
    console.log('useAuth authStore.isLogin', authStore.isLogin, path, fullPath);

    console.log('useAuth parseUrl', parseUrl(fullPath));

    console.log('useAuth ignoredPages', fullPath, ignoredPages.includes(fullPath));
    // return;

    if (!authStore.isLogin && !ignoredPages.includes(path)) {
      setTimeout(() => {
        navTo({
          url: loginPageUrl,
          query: { to: fullPath },
          redirect: true,
        });
      }, 0);
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
