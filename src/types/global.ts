// Define the message types
export type MessageType = "getData" | "sendData" | "logMessage";

// Define the structure of data associated with each message type
export interface MessageData {
  getData: { id: number };
  sendData: { content: string };
  logMessage: { level: "info" | "warn" | "error"; message: string };
}

// Define the expected response types for each message type
export interface MessageResponse {
  getData: { id: number; value: string };
  sendData: { success: boolean };
  logMessage: void;
}