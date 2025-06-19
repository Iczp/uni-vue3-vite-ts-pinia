// 深拷贝
export function deepClone<T extends Date>(source: T): T;
export function deepClone<T extends Array<any>>(source: T): T;
export function deepClone<T extends object>(source: T): T;
export function deepClone<T>(source: T): T {
  if (Array.isArray(source)) {
    return source.map((item) => deepClone(item)) as any;
  } else if (source instanceof Date) {
    return new Date(source.getTime()) as any;
  } else if (source && typeof source === 'object') {
    return Object.getOwnPropertyNames(source).reduce((o, prop) => {
      Object.defineProperty(
        o,
        prop,
        Object.getOwnPropertyDescriptor(source, prop)!
      );
      o[prop] = deepClone((source as { [key: string]: any })[prop]);
      return o;
    }, Object.create(Object.getPrototypeOf(source)));
  } else {
    return source as T;
  }
}
