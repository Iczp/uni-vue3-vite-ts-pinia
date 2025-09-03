import {
  AUTH_CLIENT_ID,
  AUTH_CLIENT_SCOPE,
  AUTH_CLIENT_SECRET,
  AUTH_GRANT_TYPE,
  AUTH_TOKEN_URL,
} from '@/config/env';
import { jsonParse } from '@/utils/object';
export const authStorageKey = 'auth-token-v1.0';
export const authUserStorageKey = 'auth-user-v1.0';
const request = async <T = any>(args: {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: { [key: string]: any };
  isLoading?: boolean;
  isShowError?: boolean;
  [key: string]: any;
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    const regex = /^(https?:\/\/)/gi;
    const isExternalUrl = regex.test(args.url || '');
    const url = isExternalUrl ? args.url : AUTH_TOKEN_URL + args.url;
    console.log('request url', isExternalUrl, url);
    const input = {
      method: args.method || 'POST',
      data: args.data,
      dataType: 'json',
      responseType: 'json',
      ...args,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...args.header,
      },
      url,
    };
    // console.log('request input', JSON.stringify(input));
    const task = uni.request({
      ...input,
      success: res => {
        console.log('request success', res);
        if (res.statusCode === 200) {
          // 返回解析后的数据，并指定泛型类型
          resolve(res.data as T);
        } else {
          console.error('Request failed with status code:', res.statusCode);
          // console.error('Response data:', res.data);
          reject(res);
        }
      },
      fail: err => {
        console.error('request input', JSON.stringify(input));
        console.error('request fail', JSON.stringify(err));
        reject(err);
      },
    });
  });
};

// 使用示例
export const fetchToken = (data: { [key: string]: any }) => {
  console.log('fetchToken');
  return request<AuthApi.TokenDto>({
    url: `/connect/token`,
    method: 'POST',
    data: {
      client_id: AUTH_CLIENT_ID,
      client_secret: AUTH_CLIENT_SECRET,
      grant_type: AUTH_GRANT_TYPE,
      scope: AUTH_CLIENT_SCOPE,
      ...data,
    },
  });
};

export const refreshToken = (refreshToken: string) => {
  console.log('refreshToken');
  return request<AuthApi.TokenDto>({
    url: `/connect/token`,
    method: 'POST',

    data: {
      grant_type: 'refresh_token', // 刷新令牌授权类型
      client_id: AUTH_CLIENT_ID,
      client_secret: AUTH_CLIENT_SECRET,
      refresh_token: refreshToken, // 传递刷新令牌
    },
  });
};

export const isExpired = (token: AuthApi.TokenDto | null | undefined) => {
  console.log('isExpired', token);
  if (!token) {
    return true;
  }
  const { creation_time, expires_in } = token;
  if (!creation_time || !expires_in) {
    return true; // 如果没有创建时间或有效期，则视为已过期
  }
  const createTicks = new Date(creation_time).getTime(); // 创建时间的毫秒表示
  const now = new Date().getTime(); // 当前时间的毫秒表示
  const tokenDuration = Number(expires_in) * 1000; // 有效期转换为毫秒
  const expired = now - createTicks > tokenDuration; // 判断是否过期
  // console.warn('isExpired', expired, now, createTicks, tokenDuration, token);
  return expired;
};

export const getTokenStorageKey = (userId?: string | null) => {
  return authStorageKey + (userId ? `-${userId}` : '');
};

export const getLocalToken = (userId: string | null) => {
  const tokenKey = getTokenStorageKey(userId);
  console.log('getLocalToken key', tokenKey);
  const token = uni.getStorageSync(tokenKey);
  // let token = jsonParse(storeValue) as AuthApi.TokenDto | null;
  console.log('getLocalToken', userId, token);
  if (isExpired(token)) {
    console.warn('getLocalToken expired', userId, token);
    // removeLocalToken(userId);

    return null;
  }
  return token;
};

export const setLocalToken = (token: AuthApi.TokenDto, userId?: string | null) => {
  uni.setStorageSync(getTokenStorageKey(userId), token);
};

export const removeLocalToken = (userId?: string | null) => {
  uni.removeStorageSync(getTokenStorageKey(userId));
};

export const getUserInfo = (authorization: string) => {
  console.log('getUserInfo');
  return request<AuthApi.TokenDto>({
    url: `/connect/userinfo`,
    method: 'POST',
    header: {
      Authorization: authorization, // 将刷新令牌作为 Bearer 令牌传递
    },
    data: {},
  });
};

const getUserStorageKey = (userId?: string | null) => {
  return authUserStorageKey + (userId ? `-${userId}` : '');
};
export const getLocalUser = (userId?: string) => {
  const storeValue = uni.getStorageSync(getUserStorageKey(userId));
  let user = jsonParse(storeValue);
  return user;
};

export const setLocalUser = (user: AuthApi.UserInfo) => {
  uni.setStorageSync(getUserStorageKey(user?.sub), JSON.stringify(user));
};

export const removeLocalUser = (userId?: string | null) => {
  uni.removeStorageSync(getUserStorageKey(userId));
};
