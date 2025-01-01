import { CommunicationAdapter } from "./CommunicationAdapter";

export class WebView2Adapter implements CommunicationAdapter {
  /**
   * Sends a message to the Windows WebView2 client via `window.asyncBridge`.
   * 
   * @param message - The method name to invoke on the client.
   * @param data - Optional data to pass to the client method.
   * @returns A promise resolving to the response from the client.
   */
  async sendMessage<T, R>(message: string, data?: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (window.asyncBridge && typeof window.asyncBridge[message] === "function") {
        try {
          const result = window.asyncBridge[message](JSON.stringify(data));
          resolve(result as R);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error(`Method ${message} is not available on asyncBridge`));
      }
    });
  }

  /**
   * Registers a callback to handle messages from the Windows WebView2 client.
   * 
   * @param callback - A function to process incoming messages and data.
   * @returns A cleanup function to remove the listener.
   */
  onMessage(callback: (message: string, data?: any) => void): () => void {
    const handler = (event: MessageEvent) => {
      if (event.data && typeof event.data === "object") {
        callback(event.data.message, event.data.data);
      }
    };

    // Add the event listener
    if (window.chrome?.webview) {
      window.chrome.webview.addEventListener("message", handler);
    } else {
      console.warn("window.chrome.webview is not available.");
    }

    // Return a cleanup function to remove the event listener
    return () => {
      if (window.chrome?.webview) {
        window.chrome.webview.removeEventListener("message", handler);
      }
    };
  }
}
