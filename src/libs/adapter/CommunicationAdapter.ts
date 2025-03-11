export interface CommunicationAdapter<M = string, D = unknown, R = unknown> {
  sendMessage(message: M, data?: D): Promise<R>;
  onMessage(callback: (message: M, data?: D) => void): void|(() => void);
}
