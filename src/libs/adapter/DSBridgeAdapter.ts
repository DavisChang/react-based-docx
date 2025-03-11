import { CommunicationAdapter } from "./CommunicationAdapter";
import dsBridge from "dsbridge";

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

  private registeredHandlers: { [key: string]: (data: string) => void } = {};

  async sendMessage<T, R>(message: string, data?: T): Promise<R> {
    return new Promise((resolve, reject) => {
      if (dsBridge && typeof dsBridge.call === "function") {
        try {
          dsBridge.call(message, JSON.stringify(data), (response: R) => {
            resolve(response);
          });
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
    if (dsBridge && typeof dsBridge.register === "function") {
      const handler = (data: string) => {
        try {
          const parsedData = JSON.parse(data);
          callback(parsedData.message, parsedData.data);
        } catch (error) {
          console.error(
            "[DSBridgeAdapter] Failed to parse message data:",
            error
          );
        }
      };

      dsBridge.register("onMessage", handler);
      this.registeredHandlers["onMessage"] = handler;

      // Return a function to override and unregister
      return () => {
        if (this.registeredHandlers["onMessage"]) {
          dsBridge.register("onMessage", function () {
            console.log("[DSBridgeAdapter] onMessage unregistered.");
          });
          delete this.registeredHandlers["onMessage"];
        }
      };
    } else {
      console.warn(
        "[DSBridgeAdapter] dsBridge is not available or 'register' method is missing."
      );
      return () => {};
    }
  }
}
