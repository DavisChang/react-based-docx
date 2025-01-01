import { CommunicationAdapter } from "./CommunicationAdapter";

export class IframeAdapter implements CommunicationAdapter {
  async sendMessage<T, R>(message: string, data?: T): Promise<R> {
    console.log("IframeAdapter sendMessage");
    return new Promise((resolve, reject) => {
      const targetWindow = window.parent || window.opener;
      if (!targetWindow) {
        reject(new Error("No parent window available for communication"));
        return;
      }

      const messageId = Date.now().toString();
      const listener = (event: MessageEvent) => {
        if (event.data.id === messageId) {
          window.removeEventListener("message", listener);
          resolve(event.data.response);
        }
      };

      window.addEventListener("message", listener);
      console.log("targetWindow.postMessage:", {
        id: messageId,
        message,
        data,
      });
      targetWindow.postMessage({ id: messageId, message, data }, "*");
    });
  }

  onMessage(callback: (message: string, data?: any) => void): void {
    console.log("IframeAdapter onMessage");
    window.addEventListener("message", (event) => {
      if (event.origin !== "EXPECTED_ORIGIN") return; // Add origin check
      if (
        !event.data ||
        !event.data.type ||
        event.data.type !== "EXPECTED_TYPE"
      )
        return; // Validate message structure

      const { message, data } = event.data;
      callback(message, data);
    });
  }
}
