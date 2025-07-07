import { fetchToken, isExpired, refreshToken } from '@/api/authApi';
import { jsonParse } from '@/utils/object';

const authStorageKey = 'auth-v1.0';

export const useAuth = defineStore({
  id: 'auth',
  state: () => {
    const storeValue = uni.getStorageSync(authStorageKey);
    console.log('useAuth storeValue', authStorageKey, storeValue);
    let token = jsonParse(storeValue);
    if (isExpired(token)) {
      token = null;
    }
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
    },
    async refreshToken() {
      if (!this.token) return;
      const token = await refreshToken(this.token!.refresh_token!);
      this.setToken(token);
    },
  },
});
