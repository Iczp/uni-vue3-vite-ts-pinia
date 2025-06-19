export const isEmpty = (v: any) => !v && v != 0;

export const toQueryString = (obj: Object) => {
  var str: string[] = [];
  // console.log('p', p,obj[p],obj.hasOwnProperty(p))
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      let value = obj[p];
      console.log("value", value, isEmpty(value));
      if (typeof value == "object") {
        value = JSON.stringify(value);
      }
      str.push(
        encodeURIComponent(p) +
          "=" +
          (!isEmpty(value) ? encodeURIComponent(value as string) : "")
      );
    }
  return str.join("&");
};

export const toUrl = (uri: string, obj: any) => {
  // console.log('toUrl', uri, obj)
  if (!obj) {
    return uri;
  }
  const and = uri.indexOf("?") !== -1 ? "&" : "?";
  const url = uri + and + toQueryString(obj);
  // console.log('toUrl', url)
  return url;
};

type AnimationType =
  | "pop-in"
  | "auto"
  | "none"
  | "slide-in-right"
  | "slide-in-left"
  | "slide-in-top"
  | "slide-in-bottom"
  | "fade-in"
  | "zoom-out"
  | "zoom-fade-out";

export const navTo = (
  uri: string,
  obj: any,
  opts: { animationType?: AnimationType } = { animationType: "pop-in" }
) =>
  uni.navigateTo({
    url: toUrl(uri, obj),
    animationType: opts.animationType,
    fail(err) {
      console.error(err);
    },
  });

export const redirectTo = (uri: string, obj: any) =>
  uni.redirectTo({
    url: toUrl(uri, obj),
    fail(err) {
      console.error(err);
    },
  });

export const jsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};
