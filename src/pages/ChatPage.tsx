import React, { useState, useEffect, useRef } from "react";
import { useQuery, gql } from "@apollo/client";

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
  id: string;
  userName: string;
  message: string;
  fromUserId?: string;
  targetUserId?: string | null;
  isRead?: boolean;
  time?: string;
}

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

const ChatPage = () => {
  const user = JSON.parse(localStorage.getItem("currentUser") || sessionStorage.getItem("currentUser") || "{}");
  const userName = user?.username || "Guest";
  const userId = user?.id || "";
  const [messages, setMessages] = useState<Message[]>([]);
  const [myMessage, setMyMessage] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [targetUserId, setTargetUserId] = useState<string>("all");
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const [unreadCounts, setUnreadCounts] = useState<{ [userId: string]: number }>({});
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const ws = useRef<WebSocket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const { loading, error, data } = useQuery(GET_USERS);

  useEffect(() => {
    if (data && data.users) {
      setUsers(data.users);
    }
  }, [data]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    ws.current = new WebSocket("ws://127.0.0.1:4000");

    ws.current.onopen = () => {
      ws.current?.send(JSON.stringify({ type: "join", userId }));
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "onlineUsers") {
          setOnlineUserIds(data.users);
          return;
        }

        if (data.type === "typing") {
          const isFromOthers = data.userName !== userName;
          const isTypingToMe = !data.targetUserId || data.targetUserId === userId;

          if (isFromOthers && isTypingToMe) {
            setTypingUser(data.userName);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
          }
          return;
        }

        if (data.type === "message") {
          setMessages((prev) => [data, ...prev]);

          if (data.userName !== userName && (!data.targetUserId || data.targetUserId === userId)) {
            if (document.hidden && Notification.permission === "granted") {
              new Notification(`رسالة جديدة من ${data.userName}`, {
                body: data.message,
                icon: "/favicon.ico",
              });
            }

            setUnreadCounts((prev) => ({
              ...prev,
              [data.fromUserId]: (prev[data.fromUserId] || 0) + 1,
            }));

            if (data.targetUserId === userId && ws.current?.readyState === WebSocket.OPEN) {
              ws.current.send(
                JSON.stringify({
                  type: "read",
                  messageId: data.id,
                  fromUserId: userId,
                  toUserId: data.fromUserId,
                })
              );
            }
          }

          return;
        }

        if (data.type === "read") {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === data.messageId ? { ...msg, isRead: true } : msg
            )
          );
          return;
        }
      } catch (err) {
        console.error("Error parsing message", err);
      }
    };

    ws.current.onclose = () => {};

    return () => {
      ws.current?.close();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [userName, userId]);

  useEffect(() => {
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current > 15 * 60 * 1000) {
        alert("تم تسجيل خروجك بسبب عدم النشاط.");
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
        window.location.href = "/login";
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  const sendMessage = () => {
    if (myMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const msgObj = {
        type: "message",
        id: Date.now().toString(),
        userName,
        message: myMessage.trim(),
        fromUserId: userId,
        targetUserId: targetUserId === "all" ? null : targetUserId,
        time,
      };

      ws.current.send(JSON.stringify(msgObj));
      setMyMessage("");
    }
  };

  const handleScroll = () => {
    if (chatBoxRef.current && chatBoxRef.current.scrollTop === 0 && hasMoreMessages) {
      const moreMessages: Message[] = [];
      setMessages((prev) => [...prev, ...moreMessages]);
      if (moreMessages.length === 0) setHasMoreMessages(false);
    }
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700 flex flex-col">
        <h2 className="text-xl font-bold mb-4">المستخدمون</h2>
        <select
          className="mb-4 p-2 rounded bg-gray-700 text-white"
          value={targetUserId}
          onChange={(e) => setTargetUserId(e.target.value)}
        >
          <option value="all">الكل</option>
          {users.filter((u) => u.username !== userName).map((user) => (
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
            {users.map((user) => {
              const isOnline = onlineUserIds.includes(user.id);
              return (
                <li key={user.id} className={`p-2 rounded ${user.username === userName ? "bg-green-700" : "bg-gray-700 hover:bg-gray-600"}`}>
                  <div className="font-semibold flex justify-between">
                    {user.name}
                    <span className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}>
                      ● {isOnline ? "متصل" : "غير متصل"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-300">@{user.username}</div>
                  <div className="text-xs text-gray-400">{user.role === "Administrator" ? "مدير" : "طالب"}</div>
                  {unreadCounts[user.id] && (
                    <div className="text-xs text-red-400 mt-1">{unreadCounts[user.id]} رسالة غير مقروءة</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">الدردشة: {userName}</h2>

        <div ref={chatBoxRef} onScroll={handleScroll} className="flex-1 border border-gray-700 rounded p-4 mb-4 overflow-y-auto" style={{ backgroundColor: "#1e293b" }}>
          {[...messages].reverse().map((msg, index) => {
            const isMyMessage = msg.userName === userName;
            const isForMe = !msg.targetUserId || msg.targetUserId === userId;
            if (!isMyMessage && !isForMe) return null;

            return (
              <div key={index} className={`mb-2 p-2 rounded ${isMyMessage ? "bg-green-600 text-white ml-auto" : "bg-gray-700 text-white"}`} style={{ maxWidth: "75%" }}>
                <div className="flex justify-between items-center">
                  <strong>{msg.userName}:</strong>
                  <span className="text-xs text-gray-300 ml-2">{msg.time || ""}</span>
                </div>
                {msg.message}
                {msg.targetUserId && <em className="text-xs"> (خاص)</em>}
                {isMyMessage && (
                  <div className="flex justify-between items-center text-xs text-gray-300 mt-1">
                    <span>{msg.isRead ? "✓ تم القراءة" : "⏳ لم تُقرأ بعد"}</span>
                    <button onClick={() => deleteMessage(msg.id)} className="ml-2 text-red-400 hover:text-red-500">🗑 حذف</button>
                  </div>
                )}
              </div>
            );
          })}

          {typingUser && (
            <div className="text-sm text-gray-300 italic mb-2 animate-pulse">
              ✍️ {typingUser} تكتب الآن...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={myMessage}
            onChange={(e) => {
              setMyMessage(e.target.value);
              if (ws.current?.readyState === WebSocket.OPEN) {
                ws.current.send(
                  JSON.stringify({
                    type: "typing",
                    userName,
                    fromUserId: userId,
                    targetUserId: targetUserId === "all" ? null : targetUserId,
                  })
                );
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="اكتب رسالتك..."
            className="flex-1 p-2 rounded bg-gray-700 text-white"
          />
          <button onClick={sendMessage} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;