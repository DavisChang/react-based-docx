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
}

declare namespace NodeJS {
  interface Process {
    type?: "browser" | "renderer" | "worker";
  }
}
