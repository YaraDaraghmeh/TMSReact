import React, { useState, useEffect, useRef } from "react";
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query {
    users {
      id
      username
      name
      role
    }
  }
`;

interface Message {
  userName: string;
  message: string;
  targetUserId?: string; // إضافة ليحدد المستلم (اختياري)
}

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

const ChatPage = () => {
  const user = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || '{}');
  const userName = user?.username || 'Guest';
  const userId = user?.id || ''; 
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessage, setMyMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [targetUserId, setTargetUserId] = useState<string>('all');
  const ws = useRef<WebSocket | null>(null);

  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data && data.users) {
      setUsers(data.users);
    }
  }, [data]);

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
        fromUserId: userId,
        targetUserId: targetUserId === 'all' ? null : targetUserId
      };
      ws.current.send(JSON.stringify(msgObj));
      setMyMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* قائمة المستخدمين مع اختيار المستلم */}
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
        <h2 className="text-xl font-bold mb-4">المستخدمون</h2>
        <select
          className="mb-4 p-2 rounded bg-gray-700 text-white"
          value={targetUserId}
          onChange={e => setTargetUserId(e.target.value)}
        >
          <option value="all">الكل</option>
          {users
            .filter(u => u.username !== userName)
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} (@{user.username})
              </option>
          ))}
        </select>

        {loading ? (
          <p>جاري التحميل...</p>
        ) : error ? (
          <p className="text-red-500">خطأ في جلب المستخدمين</p>
        ) : (
          <ul className="space-y-2 overflow-auto flex-1">
            {users.map((user) => (
              <li 
                key={user.id} 
                className={`p-2 rounded ${user.username === userName ? 'bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-300">@{user.username}</div>
                <div className="text-xs text-gray-400">{user.role === 'Administrator' ? 'مدير' : 'طالب'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* منطقة الدردشة */}
      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">الدردشة: {userName}</h2>

        <div
          className="flex-1 border border-gray-700 rounded p-4 mb-4 overflow-y-auto"
          style={{ backgroundColor: "#1e293b" }}
        >
          {messages.map((msg, index) => {
            const isMyMessage = msg.userName === userName;
            const isForMe = !msg.targetUserId || msg.targetUserId === userId;
            if (!isMyMessage && !isForMe) return null;

            return (
              <div
                key={index}
                className={`mb-2 p-2 rounded ${
                  isMyMessage ? "bg-green-600 text-white ml-auto" : "bg-gray-700 text-white"
                }`}
                style={{ maxWidth: "75%" }}
              >
                <strong>{msg.userName}:</strong> {msg.message}
                {msg.targetUserId && <em className="text-xs"> (خاص)</em>}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={myMessage}
            onChange={(e) => setMyMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اكتب رسالتك..."
            className="flex-1 p-2 rounded bg-gray-700 text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
          >
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
