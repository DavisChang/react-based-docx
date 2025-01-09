import { CommunicationAdapter } from "./CommunicationAdapter";

/**
 * Adapter for integrating with DSBridge-Android for two-way communication.
 */
export class DSBridgeAdapter implements CommunicationAdapter {
  /**
   * Sends a message to the Android client via DSBridge.
   *
   * @param message - The method name to invoke on the client.
   * @param data - Optional data to pass to the client method.
   * @returns A promise resolving to the response from the client.
   */
  async sendMessage<T, R>(message: string, data?: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (window.dsBridge && typeof window.dsBridge.call === "function") {
        try {
          const response = window.dsBridge.call(message, JSON.stringify(data));
          resolve(response as R);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(
          new Error("DSBridge is not available or 'call' method is missing.")
        );
      }
    });
  }

  /**
   * Registers a callback to handle messages sent from the Android client.
   *
   * @param callback - A function to process incoming messages and data.
   * @returns A cleanup function to remove the listener.
   */
  onMessage(callback: (message: string, data?: any) => void): () => void {
    if (window.dsBridge && typeof window.dsBridge.register === "function") {
      const handler = (data: string) => {
        try {
          const parsedData = JSON.parse(data);
          callback(parsedData.message, parsedData.data);
        } catch (error) {
          console.error("Failed to parse message data from DSBridge:", error);
        }
      };

      window.dsBridge.register("onMessage", handler);

      // Return a cleanup function to unregister the handler
      return () => {
        if (
          window.dsBridge &&
          typeof window.dsBridge.unregister === "function"
        ) {
          window.dsBridge.unregister("onMessage");
        }
      };
    } else {
      console.warn(
        "DSBridge is not available or 'register' method is missing."
      );

      // Return a no-op cleanup function
      return () => {};
    }
  }
}
