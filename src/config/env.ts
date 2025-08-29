
export const APP_TITLE = import.meta.env.VITE_APP_TITLE || '应用';
export const WEB_HOST = import.meta.env.VITE_WEB_HOST;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CHAT_BASE_URL = import.meta.env.VITE_CHAT_BASE_URL;
// # auth
export const AUTH_TOKEN_URL = import.meta.env.VITE_AUTH_TOKEN_URL;
export const AUTH_CLIENT_ID = import.meta.env.VITE_AUTH_CLIENT_ID;
export const AUTH_CLIENT_SECRET = import.meta.env.VITE_AUTH_CLIENT_SECRET;
export const AUTH_GRANT_TYPE = import.meta.env.VITE_AUTH_GRANT_TYPE || 'client_credentials';  
export const AUTH_CLIENT_SCOPE = import.meta.env.VITE_AUTH_CLIENT_SCOPE;


const apiEnv: ApiEnv = 'dev';

const envMap = {
  dev: {
    baseUrl: 'http://m.dev.xxx.com',
    apiBaseUrl: 'https://m.devapi.xxx.com',
  },
  beta: {
    baseUrl: 'http://m.beta.xxx.com',
    apiBaseUrl: 'https://m.betaapi.xxx.com',
  },
  prod: {
    baseUrl: 'https://m.xxx.com',
    apiBaseUrl: 'https://m.api.xxx.com',
  },
  local: {
    baseUrl: 'http://m.dev.xxx.com',
    apiBaseUrl: 'https://m.devapi.xxx.com',
  },
};


type ApiEnv = keyof typeof envMap;
type Env<T extends ApiEnv> = {
  apiEnv: T;
} & (typeof envMap)[T];

function createEnv(apiEnv: ApiEnv): Env<typeof apiEnv> {
  return Object.assign({ apiEnv }, envMap[apiEnv]);
}

const env = createEnv(apiEnv);
export default env;
