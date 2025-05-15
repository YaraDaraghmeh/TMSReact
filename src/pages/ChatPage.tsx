import React, { useState, useEffect, useRef } from "react";

interface Message {
  userName: string;
  message: string;
}

const ChatPage = ({ userName }: { userName: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessage, setMyMessage] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:4000");

    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (err) {
        console.error("Error parsing message", err);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (myMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
      const msgObj = {
        type: "message",
        userName,
        message: myMessage.trim(),
      };
      ws.current.send(JSON.stringify(msgObj));
      setMyMessage("");
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Chat as {userName}</h2>

      <div
        className="border border-gray-400 rounded p-4 mb-4 h-64 overflow-y-auto"
        style={{ backgroundColor: "#1e293b" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.userName === userName ? "bg-green-600 text-white ml-auto" : "bg-gray-700 text-white"
            }`}
            style={{ maxWidth: "75%" }}
          >
            <strong>{msg.userName}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={myMessage}
          onChange={(e) => setMyMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 p-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
