// 确保这是模块声明
export {};

declare global {
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
