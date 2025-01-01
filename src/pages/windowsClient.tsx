import { useEffect, useState } from "react";
import { CommunicationFactory } from "../libs/adapter/CommunicationFactory";

const WindowsClient = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State for
  const adapter = CommunicationFactory.createAdapter();

  useEffect(() => {
    console.log("useEffect adapter.onMessage", adapter);
    adapter.onMessage((message, data) => {
      console.log("onMessage");
      setMessages((prevMessages) => [
        ...prevMessages,
        `${message}: ${JSON.stringify(data)}`,
      ]);
    });
  }, [adapter]);

  const sendMessage = async () => {
    console.log("sendMessage:", adapter);
    setIsLoading(true); // Set loading to true
    try {
      const response = await adapter.sendMessage("getData", { id: 42 });
      console.log("Response from client:", response);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>WindowsClient</h1>
      <h2>adapter: {adapter && adapter?.constructor?.name}</h2>
      <button onClick={sendMessage} disabled={isLoading}>
        {isLoading ? "Sending..." : "Send Message"}
      </button>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
};

export default WindowsClient;
