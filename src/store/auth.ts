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
  setLocalToken,
} from '@/api/authApi';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    return {
      userId: null,
      token: null,
      user: null,
    } as {
      token?: Auth.Token | null;
      userId: string | null;
      user?: AuthApi.UserInfo | null;
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
    setUserId(userId: string | null) {
      this.userId = userId;
      if (!userId) {
        return;
      }
      this.user = getLocalUser(userId) as AuthApi.UserInfo | null;
    },
    async login(data: { [key: string]: any }) {
      const token = await fetchToken(data);
      this.setToken(token);
      const user = await this.getUserInfo({ force: true });
      return user;
    },
    setToken(token: Auth.Token) {
      this.token = token;
      this.token.creation_time = new Date();
      setLocalToken(token, this.userId);
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
      this.userId = user.sub || null;
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
      removeLocalUser(this.userId);
      this.user = null;
      removeLocalUser(this.userId);
    },
  },
});
