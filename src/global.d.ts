import type { ElectronAPI } from "@electron-toolkit/preload";

declare global {
  interface Window {
    asyncBridge: {
      [key: string]: (...args: unknown[]) => unknown;
    };
    chrome?: {
      webview?: {
        addEventListener: (event: string, listener: (event: MessageEvent) => void) => void;
        removeEventListener: (
          event: string,
          listener: (event: MessageEvent) => void
        ) => void;
        postMessage: (message: unknown) => void;
      };
    };
    dsBridge?: {
      call: (method: string, args?: string) => unknown;
      register: (method: string, handler: (data: string) => void) => void;
      unregister: (method: string) => void;
    };
    electron: ElectronAPI;
    parent: Window;
    opener: Window | null;
  }
}

declare namespace NodeJS {
  interface Process {
    type?: "browser" | "renderer" | "worker";
  }
}
