declare namespace UniApp {
  interface Uni {
    webView?: {
      postMessage: (message: { data: any }) => void;
      getEnv?: (callback: (res: { platform: string }) => void) => void;
    };
  }
}

export type AnimationType =
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
