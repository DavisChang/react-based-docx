import { CommunicationAdapter } from "./CommunicationAdapter";

export class ElectronAdapter implements CommunicationAdapter {
  // @ts-ignore
  async sendMessage<T, R>(message: string, data?: T): Promise<R> {
    // Return a resolved Promise with null or undefined

    return window.electron.ipcRenderer.invoke(message, data);

    // return Promise.resolve(null as unknown as R);
  }
  // @ts-ignore
  onMessage(callback: (message: string, data?: any) => void): void {
    // No-op implementation
    // You can optionally log or do nothing

    window.electron.ipcRenderer.on("message", (_event, message, data) => {
      callback(message, data);
    });
  }
}
