import {
  fetchToken,
  getLocalToken,
  isExpired,
  refreshToken,
  authStorageKey,
  getUserInfo,
  getLocalUser,
  setLocalUser,
  removeLocalUser,
} from '@/api/authApi';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    const token = getLocalToken();
    return {
      token,
      user: getLocalUser(),
    } as {
      token?: Auth.Token | null;
      user: AuthApi.UserInfo | null;
    };
  },
  getters: {
    isLogin: state => {
      return !!state.token;
    },
    isExpired: state => {
      return isExpired(state.token);
    },
    accessToken: state => {
      return state.token?.access_token;
    },
    authorization: state => {
      return `${state.token?.token_type || 'Bearer'} ${state.token?.access_token}`;
    },
  },
  actions: {
    async login(data: { [key: string]: any }) {
      const token = await fetchToken(data);
      this.setToken(token);
      return token;
    },
    setToken(token: Auth.Token) {
      this.token = token;
      this.token.creation_time = new Date();
      uni.setStorageSync(authStorageKey, JSON.stringify(token));
    },
    async fetchToken(erpHeader: any) {
      // const erpHeader = {};
      const token = await fetchToken(erpHeader);
      this.setToken(token);
      return token;
    },
    async getUserInfo(args?: { force?: boolean }) {
      // const erpHeader = {};
      if (this.user && !args?.force) {
        return this.user;
      }
      const user = await getUserInfo(this.authorization);
      this.user = user;
      setLocalUser(user);
      return user;
    },

    async refreshToken() {
      if (!this.token) {
        throw new Error('token is null');
      }
      const token = await refreshToken(this.token!.refresh_token!);
      this.setToken(token);
      return token;
    },
    async getOrRefreshToken() {
      if (!this.token) return;
      if (isExpired(this.token)) {
        return await this.refreshToken();
      }
      return this.token;
    },
    logout() {
      this.token = null;
      uni.removeStorageSync(authStorageKey);
      this.user = null;
      removeLocalUser();
    },
  },
});
