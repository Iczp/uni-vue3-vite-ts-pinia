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

export function getLastPage() {
  // return null;
  console.log('getLastPage', typeof getCurrentPages);
  try {
    // getCurrentPages() 至少有1个元素，所以不再额外判断
    // const lastPage = getCurrentPages().at(-1)
    // 上面那个在低版本安卓中打包会报错，所以改用下面这个【虽然我加了 src/interceptions/prototype.ts，但依然报错】
    const pages = getCurrentPages() || [];
    return pages[pages.length - 1] || null;
  } catch (error) {
    console.error('getLastPage error', error);
    return null;
  }
}
