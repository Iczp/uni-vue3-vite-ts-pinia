import type { InvokeInput, InvokeResult } from '@/@types/bridge';
import { jsonParse } from '@/utils/object';
import { isHtml5Plus } from '@/utils/platform';
export const invoke = (input: InvokeInput) =>
  new Promise<InvokeResult>((resolve, reject) => {
    console.log('bridge');
    const webView = uni?.['webView'];
    try {
      if (!webView) {
        reject({ message: `非App环境`, input });
        console.warn('invoke', `非App环境`, input);
        return;
      }

      // uni.webView?.getEnv(res => {
      // 	console.log('getEnv', JSON.stringify(res))
      // })

      const event = `native-${new Date().getTime()}`;
      uni.$once(event, (...args) => {
        console.log('invoke back:', args);
        const obj = jsonParse(args) as InvokeResult;
        if (obj?.success || obj[0]?.success || obj?.action == 'uni.$emit') {
          resolve(obj);
          return;
        }
        console.error(`invoke back(err):`, args);
        reject(obj);
      });

      webView?.postMessage({
        data: {
          // action: 'uni.vibrateLong',
          args: [],
          event,
          ...input,
        },
      });
    } catch (error) {
      console.warn('invoke', error);
      reject(error);
    }
  });

export const getSystemInfo = (...args: any[]) =>
  invoke({
    action: 'uni.getSystemInfo',
    args,
  });

export const setNavigationBarColor = (...args: any[]) =>
  invoke({
    action: 'uni.setNavigationBarColor',
    args,
  });

export const setNavigationBarTitle = (...args: any[]) =>
  invoke({
    action: 'uni.setNavigationBarTitle',
    args,
  });

export const scanCode = (...args: any[]) =>
  invoke({
    action: 'uni.scanCode',
    args,
  });

export const navigateBack = (...args: any[]) =>
  invoke({
    action: 'uni.navigateBack',
    args,
  });

export const getAuth = (...args: any[]) =>
  invoke({
    action: 'auth',
    args,
  });

export const chooseImage = (...args: any[]) =>
  invoke({
    action: 'uni.chooseImage',
    args: [
      {
        count: 6, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 从相册选择
        success(res) {
          console.log(JSON.stringify(res.tempFilePaths));
        },
      },
    ],
  });

// export const chooseImageToObject = (...args) => new Promise((resolve, reject) => {
// 	chooseImage(...args)
// 		.then(res => {
// 			console.log("chooseImageToObject", JSON.stringify(res));
// 			// 使用示例
// 			readFileAsArrayBuffer(res.result.tempFilePaths[0])
// 				.then((base64) => {
// 					const blob = base64ToBlob(base64);
// 					const blobUrl = URL.createObjectURL(blob);
// 					console.log('blobUrl:', blobUrl);
// 					resolve({ blob, blobUrl });
// 				})
// 				.catch((err) => {
// 					console.error('错误:', JSON.stringify(err));
// 					reject(err)
// 				});
// 		}).catch(reject)
// })

export const navToWebview = (...args: any[]) => {
  console.log('navToWebview', isHtml5Plus, args);
  console.log('import.meta.env', import.meta.url);
  if (!isHtml5Plus) {
    return uni.navigateTo({
      url: args[0],
      fail(err) {
        console.error(err);
      },
    });
  }

  const regex = /^(https?:\/\/)/;
  if (!regex.test(args[0])) {
    args[0] = `http://10.0.5.20:4000/#${args[0]}`;
  }
  return invoke({
    action: 'navToWebview',
    args,
  });
};

export const $emit = (...args: any[]) =>
  invoke({
    action: 'uni.$emit',
    args,
  });
export const $on = (...args: any[]) =>
  invoke({
    action: 'uni.$on',
    args,
  });
export const $once = (...args: any[]) =>
  invoke({
    action: 'uni.$once',
    args,
  });
