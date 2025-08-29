/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      VITE_WEB_HOST: string;
      VITE_CHAT_BASE_URL: string;
      VITE_API_BASE_URL: string;
      VITE_APP_TITLE: string;
      VITE_AUTH_TOKEN_URL: string;
      VITE_AUTH_CLIENT_ID: string;
      VITE_AUTH_CLIENT_SECRET: string;
      VITE_AUTH_CLIENT_SCOPE: string;
      VITE_AUTH_GRANT_TYPE: string;
    }
  }
}
