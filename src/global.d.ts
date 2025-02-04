import type { ElectronAPI } from "@electron-toolkit/preload";

interface Window {
  asyncBridge: {
    [key: string]: (...args: any[]) => any;
  };
  chrome?: {
    webview?: {
      addEventListener: (event: string, listener: (event: any) => void) => void;
      removeEventListener: (
        event: string,
        listener: (event: any) => void
      ) => void;
      postMessage: (message: any) => void;
    };
  };
  dsBridge?: {
    call: (method: string, args?: string) => any;
    register: (method: string, handler: (data: string) => void) => void;
    unregister: (method: string) => void;
  };
}

declare namespace NodeJS {
  interface Process {
    type?: "browser" | "renderer" | "worker";
  }
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
