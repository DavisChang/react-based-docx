import { CommunicationAdapter } from "./CommunicationAdapter";

export class NormalWebsiteAdapter
  implements CommunicationAdapter<string, unknown, unknown>
{
  /**
   * Sends a message. Placeholder implementation.
   * @param message - The message type or identifier.
   * @param data - Optional data associated with the message.
   * @returns A promise that resolves with a placeholder response.
   */
  async sendMessage(message: string, data?: unknown): Promise<unknown> {
    console.warn(
      "NormalWebsiteAdapter.sendMessage() called. No implementation provided.",
      { message, data }
    );
    return Promise.resolve(null);
  }

  /**
   * Registers a callback to handle incoming messages. Placeholder implementation.
   * @param callback - A function to handle the received message and optional data.
   * @returns A function to remove the event listener.
   */

  // @ts-ignore
  onMessage(callback: (message: string, data?: unknown) => void): () => void  {
    console.warn(
      "NormalWebsiteAdapter.onMessage() called. No implementation provided."
    );

    // Return cleanup function to remove listener when needed
    return () => {
      console.log("NormalWebsiteAdapter onMessage listener removed.");
    };
  }
}
