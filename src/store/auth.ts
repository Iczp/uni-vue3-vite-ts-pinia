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

export const useAuth = defineStore({
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
    async getUserInfo(force: boolean = false) {
      // const erpHeader = {};
      if (this.user && !force) {
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
