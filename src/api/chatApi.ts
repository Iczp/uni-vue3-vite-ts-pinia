import { useAuth } from '@/store/auth';
import { version } from '../../package.json';

export const formatPostData = (data: any) => {
  // 使用 Object.fromEntries 将键值对数组转换为对象
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(
      ([key, value]) => value !== null && value !== '' && value !== undefined,
    ),
  );
  return filteredData;
};
const chatRequest = async <T = any>(args: {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  header?: { [key: string]: any };
  isLoading?: boolean;
  isShowError?: boolean;
  dataType?: string;
  responseType?: string;
  [key: string]: any;
}): Promise<T> => {
  return new Promise((resolve, reject) => {
    const url = args.url?.toLocaleLowerCase().startsWith('http')
      ? args.url
      : import.meta.env.VITE_CHAT_BASE_URL + args.url;
    console.log('request url', url);

    const auth = useAuth();
    // console.log('auth.token', auth.token);
    const input = {
      url,
      method: args.method || 'POST',
      data: formatPostData(args.data),
      header: {
        'Content-Type': 'application/json', // 假设使用 JSON 格式,
        Version: version,
        Authorization: auth.authorization,
        ...args.header,
      },
      dataType: args?.dataType || 'json',
      responseType: args?.responseType || 'json',
    };
    console.log('request input', input);
    const task = uni.request({
      ...input,
      success: res => {
        console.log('request success', res);
        if (res.statusCode >= 200 || res.statusCode < 400) {
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

export const getConnectionPool = (data?: ChatApi.GetListInput) =>
  chatRequest({
    url: '/api/chat/connection-pool',
    method: 'GET',
    data,
  });

export const getChatObjectByCurrentUser = (data?: ChatApi.GetListInput) =>
  chatRequest<ChatApi.PagedResult<ChatApi.ChatObjectDto>>({
    url: '/api/chat/chat-object/by-current-user',
    method: 'GET',
    data,
  });

export const getBadgeByCurrentUser = (data?: { isImmersed?: boolean }) =>
  chatRequest<ChatApi.BadgeDto[]>({
    url: '/api/chat/session-unit/badge-by-current-user',
    method: 'GET',
    data,
  });

export const getSessionUnitList = (data?: ChatApi.SessionUnitListInput) =>
  chatRequest<ChatApi.PagedResult<ChatApi.SessionUnitDto>>({
    url: '/api/chat/session-unit',
    method: 'GET',
    data,
  });
