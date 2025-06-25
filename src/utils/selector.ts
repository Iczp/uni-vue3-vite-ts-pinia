import {
  $on,
  $once,
  $emit,
  navToWebview,
  invoke,
  navigateBack,
} from "@/commons/bridge";
import { toUrl } from "./nav";

export type SelectorPayload = {
  url?:string;
  [key: string]: any;
};
import AnimationType from "@/@types/uni";
// type AnimationType = "slide-in-right" | "slide-out-right" | "slide-in-left" | "slide-out-left" | "slide-in-top" | "slide-out-top" | "slide-in-bottom" | "slide-out-bottom" | "pop-in" | "pop-out" | "fade-in" | "fade-out" | "zoom-out" | "zoom-in" | "zoom-fade-out" | "zoom-fade-in" | "none";
export const selector = (payload: SelectorPayload) =>
  new Promise((resolve, reject) => {
    const event = `selector:${new Date().getTime()}`;
    uni.$once(event, (e) => {
      console.log(`H5#event:${event}`, e);
      var obj = JSON.parse(e);
      const { event: removeEvent, args, action } = obj;
      const [localEvent, payload] = args;
      resolve(payload);
    });

    // animationType:
    // slide-in-right	slide-out-right	新窗体从右侧进入
    // slide-in-left	slide-out-left	新窗体从左侧进入
    // slide-in-top	slide-out-top	新窗体从顶部进入
    // slide-in-bottom	slide-out-bottom	新窗体从底部进入
    // pop-in	pop-out	新窗体从左侧进入，且老窗体被挤压而出
    // fade-in	fade-out	新窗体从透明到不透明逐渐显示
    // zoom-out	zoom-in	新窗体从小到大缩放显示
    // zoom-fade-out	zoom-fade-in	新窗体从小到大逐渐放大并且从透明到不透明逐渐显示
    // none	none	无动画

    $once(event)
      .then((res) => {
        console.log(`$on:5566-${event}`, res);
        var url = toUrl("http://10.0.5.20:4000/#/pages/selector/selector", {
          id: 5,
          event,
          title: "请选择",
        });
        navToWebview(
          url,
          { title: "请选择人员" },
          {
            animationType: "pop-in",
            ...payload?.options,
          }
        );
      })
      .catch((err) => {
        console.log("selector err:", JSON.stringify(err));
        reject(err);
      });
  });

export const resolve = (event, payload) => {
  if (!event) {
    const message = `未设置'event'参数`;
    uni.showToast({ icon: "none", title: message });
    return Promise.reject({ message });
  }
  var task = $emit(event, payload);
  navigateBack();
  return task;
};
