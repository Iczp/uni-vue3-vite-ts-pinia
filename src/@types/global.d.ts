// 确保这是模块声明
export {};

declare global {
  interface IdDto {
    id: string | number;
    // 这里可以添加全局变量或方法
  }
  interface IdDto {
    id: string | number;
    [key: string]: any; // 允许任意额外的属性
  }

  interface GetListInput {
    skipCount?: number | null;
    maxResultCount?: number | null | undefined;
    keyword?: string | null;
    sorting?: string | null;
    [key: string]: any; // 允许任意额外的属性
  }

  interface PagedResult<T> {
    totalCount: number;
    items: T[];
    [key: string]: any; // 允许任意额外的属性
  }
  namespace PlusIo {
    interface FileReader {
      onloadend?: (e: { target: { result: any } }) => void;
      onerror?: (e: any) => void;
      readAsDataURL: (file: PlusIo.File) => void;
      readAsText: (file: PlusIo.File, encoding?: string) => void;
      readAsArrayBuffer: (file: PlusIo.File) => void;
      abort: () => void;
    }

    interface File {
      name: string;
      size: number;
      type: string;
      lastModified: number;
      lastModifiedDate: Date;
    }
  }
}
