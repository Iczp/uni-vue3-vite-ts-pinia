import type { InvokeInput, InvokeResult } from '@/@types/bridge';
import { jsonParse } from '@/utils/object';
export const invoke = (input: InvokeInput) =>
  new Promise<InvokeResult>((resolve, reject) => {
    console.log('bridge');
    const webView = uni.webView;
    try {
      if (!webView) {
        reject({ message: `非App环境`, input });
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

export const getSystemInfo = (...args) =>
  invoke({
    action: 'uni.getSystemInfo',
    args,
  });

export const setNavigationBarColor = (...args) =>
  invoke({
    action: 'uni.setNavigationBarColor',
    args,
  });

export const setNavigationBarTitle = (...args) =>
  invoke({
    action: 'uni.setNavigationBarTitle',
    args,
  });

export const scanCode = (...args) =>
  invoke({
    action: 'uni.scanCode',
    args,
  });

export const navigateBack = (...args) =>
  invoke({
    action: 'uni.navigateBack',
    args,
  });

export const getAuth = (...args) =>
  invoke({
    action: 'auth',
    args,
  });

export const chooseImage = (...args) =>
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

export const navToWebview = (...args) =>
  invoke({
    action: 'navToWebview',
    args,
  });

export const $emit = (...args) =>
  invoke({
    action: 'uni.$emit',
    args,
  });
export const $on = (...args) =>
  invoke({
    action: 'uni.$on',
    args,
  });
export const $once = (...args) =>
  invoke({
    action: 'uni.$once',
    args,
  });
