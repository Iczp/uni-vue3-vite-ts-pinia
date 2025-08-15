import { jsonParse } from '@/utils/object';
export const authStorageKey = 'auth-v1.0';
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
    const url = args.url?.toLocaleLowerCase().startsWith('http')
      ? args.url
      : import.meta.env.VITE_BASE_URL + args.url;
    console.log('request url', url);
    const input = {
      url,
      method: args.method || 'POST',
      data: args.data,
      header: {
        // 'Content-Type': 'application/json', // 假设使用 JSON 格式
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      dataType: 'json',
      responseType: 'json',
      ...args,
    };
    const task = uni.request({
      ...input,
      success: res => {
        console.log('request success', res);
        if (res.statusCode === 200) {
          // 返回解析后的数据，并指定泛型类型
          resolve(res.data as T);
        } else {
          console.error('Request failed with status code:', res.statusCode);
          console.error('Response data:', res.data);
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
export const fetchToken = (header: { [key: string]: any }) => {
  console.log('fetchLoginToken');
  return request<AuthApi.TokenDto>({
    url: import.meta.env.VITE_AUTH_TOKEN_URL,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
      client_secret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
      grant_type: import.meta.env.VITE_AUTH_GRANT_TYPE,
      scope: import.meta.env.VITE_AUTH_CLIENT_SCOPE,
      ...header,
    },
  });
};

export const refreshToken = (refreshToken: string) => {
  console.log('refreshToken');
  return request<AuthApi.TokenDto>({
    url: import.meta.env.VITE_AUTH_TOKEN_URL, // 假设您有一个环境变量指向刷新令牌的端点
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
      // 'Authorization': `Bearer ${refreshToken}`, // 将刷新令牌作为 Bearer 令牌传递
    },
    data: {
      grant_type: 'refresh_token', // 刷新令牌授权类型
      client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
      client_secret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
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

export const getLocalToken = () => {
  const storeValue = uni.getStorageSync(authStorageKey);
  // console.log('getLocalToken', authStorageKey, storeValue);
  let token = jsonParse(storeValue);
  // if (isExpired(token)) {
  //   // uni.removeStorageSync(authStorageKey);
  //   return null;
  // }
  return token;
};
