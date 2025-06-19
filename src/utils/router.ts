/// <reference types="@dcloudio/types" />
import { isFastClick, parseUrl, restoreUrl } from "./shared";
import { getUrlType, h5HsqMap, needAuthPath, pagesMap } from "./urlMap";

interface QueryParams {
  [key: string]: any;
  replace?: boolean;
}

interface PageMapItem {
  name: string;
  type: string;
  path: string;
}

export function onUrlPage(e: { currentTarget: { dataset: { url?: string } } }) {
  if (isFastClick()) return;
  const { url } = e.currentTarget.dataset;
  // url = 'http://m.dev.haoshiqi.net/v2/index?id=11&name=22'
  // url = 'https://topic.doweidu.com/?id=a9918e941a43233211fb7a8cfc7afbbd&origin=hsq_aliptmp'
  if (!url) return;
  const urlType = getUrlType(url);
  const { name, path, query } = parseUrl(url);
  if (urlType === "topic") {
    // 专题页
    forward("topic", Object.assign({ url: path }, query));
  } else if (urlType === "h5Hsq") {
    if (h5HsqMap.includes(name)) {
      if (needAuthPath.includes(name)) return forward("login");
      // h5页面
      forward("web-view", Object.assign({ url: path }, query));
    } else {
      // 原生页
      forward(name, query);
    }
  } else if (urlType === "other" && pagesMap.find((i) => i.name === name)) {
    // 原生页
    forward(name, query);
  } else {
    // 不跳转
  }
}

export function forward(
  name: string,
  query: QueryParams = {}
): void | Promise<any> {
  if (needAuthPath.includes(name)) return forward("login");
  const targetPage = pagesMap.find((i) => i.name === name);
  if (!targetPage) return;
  const isReplace = query.replace;
  delete query.replace;
  const { type, path } = targetPage;
  const url = restoreUrl(path, query);
  const params = { url } as
    | UniNamespace.SwitchTabOptions
    | UniNamespace.NavigateToOptions
    | UniNamespace.RedirectToOptions;
  if (type === "tabBarPage")
    return uni.switchTab(params as UniNamespace.SwitchTabOptions);
  if (!isReplace)
    return uni.navigateTo(params as UniNamespace.NavigateToOptions);
  uni.redirectTo(params as UniNamespace.RedirectToOptions);
}

export function back(delta: number): void {
  uni.navigateBack({
    delta,
  });
}
