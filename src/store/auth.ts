import { fetchToken, getLocalToken, isExpired, refreshToken, authStorageKey } from '@/api/authApi';

export const useAuth = defineStore({
  id: 'auth',
  state: () => {
    const token = getLocalToken();
    return {
      token,
    } as {
      token?: Auth.Token | null;
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
    async refreshToken() {
      if (!this.token) return;
      const token = await refreshToken(this.token!.refresh_token!);
      this.setToken(token);
      return token;
    },
  },
});
