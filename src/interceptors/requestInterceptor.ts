export const _requestInterceptor = {
  invoke(args: { url: string; query?: Record<string, string> }) {
    console.log('requestInterceptor', args);
  },
};

export const requestInterceptor = {
  install() {
    uni.addInterceptor('request', _requestInterceptor);
  },
};
