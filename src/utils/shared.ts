// 防止快速点击
let lastClickTime = 0;

export function isFastClick(num = 1000) {
  const time = new Date().getTime();
  if (time - lastClickTime > num) return false;
  lastClickTime = time;
  return true;
}

// 解析 path
export function parseUrl(fullPath: string) {
  const [path, queryStr] = fullPath.split('?');
  const name = path.slice(path.lastIndexOf('/') + 1);
  const query: { [key: string]: any } = {};
  queryStr
    ?.split('&')
    .filter(i => i.trim().length > 0)
    .map(i => i.split('='))
    .forEach(i => (query[i[0]] = i[1]));

  let host: any = null;
  let port: any = null;
  try {
    var url = new URL(fullPath);
    host = url.hostname;
    port = url.port;
    //
    console.log('URL', url, fullPath);
  } catch (error) {}
  return {
    host,
    port,
    name,
    path,
    query,
  };
}

// 还原url
export function restoreUrl(path: string, query: Object) {
  let count = 0;
  for (const key in query) {
    path += `${count === 0 ? '?' : '&'}${key}=${query[key]}`;
    count += 1;
  }
  return path;
}
