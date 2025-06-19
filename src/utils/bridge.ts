import { readFileAsArrayBuffer } from "./h5plus";
import { base64ToBlob } from "./nav";

export const callNative = (input) =>
  new Promise((resolve, reject) => {
    console.log("bridge");
    try {
      if (!uni?.webView) {
        reject({ message: `非App环境`, input });
        return;
      }

      // uni.webView?.getEnv(res => {
      // 	console.log('getEnv', JSON.stringify(res))
      // })

      const event = `native-${new Date().getTime()}`;
      uni.$once(event, (...args) => {
        console.log("native clall back:", args);
        var obj = tryParseJson(args);
        if (obj?.success || obj[0]?.success || obj?.action == "uni.$emit") {
          resolve(obj);
          return;
        }
        console.error(`native clall back(reject):`, args);
        reject(obj);
      });

      uni?.webView?.postMessage({
        data: {
          // action: 'uni.vibrateLong',
          args: [],
          event,
          ...input,
        },
      });
    } catch (error) {
      console.warn("callNative", error);
      reject(error);
    }
  });

export const tryParseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    //TODO handle the exception
    console.warn("tryParseJson error", json);
  }
};

export const getSystemInfo = (...args) =>
  callNative({
    action: "uni.getSystemInfo",
    args,
  });

export const setNavigationBarColor = (...args) =>
  callNative({
    action: "uni.setNavigationBarColor",
    args,
  });

export const setNavigationBarTitle = (...args) =>
  callNative({
    action: "uni.setNavigationBarTitle",
    args,
  });

export const scanCode = (...args) =>
  callNative({
    action: "uni.scanCode",
    args,
  });

export const navigateBack = (...args) =>
  callNative({
    action: "uni.navigateBack",
    args,
  });

export const getAuth = (...args) =>
  callNative({
    action: "auth",
    args,
  });

export const chooseImage = (...args) =>
  callNative({
    action: "uni.chooseImage",
    args: [
      {
        count: 6, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: function (res) {
          console.log(JSON.stringify(res.tempFilePaths));
        },
      },
    ],
  });

export const chooseImageToObject = (...args) =>
  new Promise((resolve, reject) => {
    chooseImage(...args)
      .then((res) => {
        console.log("chooseImageToObject", JSON.stringify(res));
        // 使用示例
        readFileAsArrayBuffer(res.result.tempFilePaths[0])
          .then((base64) => {
            const blob = base64ToBlob(base64);
            const blobUrl = URL.createObjectURL(blob);
            console.log("blobUrl:", blobUrl);
            resolve({ blob, blobUrl });
          })
          .catch((err) => {
            console.error("错误:", JSON.stringify(err));
            reject(err);
          });
      })
      .catch(reject);
  });

export const navToWebview = (...args) =>
  callNative({
    action: "navToWebview",
    args,
  });

export const $emit = (...args) =>
  callNative({
    action: "uni.$emit",
    args,
  });
export const $on = (...args) =>
  callNative({
    action: "uni.$on",
    args,
  });
export const $once = (...args) =>
  callNative({
    action: "uni.$once",
    args,
  });
