import React, { useState } from "react";

const ChatPage = () => {
  const [selectedStudent, setSelectedStudent] = useState("Ali Yaseen");
  const [message, setMessage] = useState("");

  const students = [
    "Ali Yaseen",
    "Braa Aeesh",
    "Ibn Al-Jawzee",
    "Ibn Malik",
    "Ayman Outom",
    "Salah Salah",
    "Yahya Leader",
    "Salam Kareem",
    "Isaac Nasir",
    "Saeed Salam",
  ];

  const handleSend = () => {
    if (message.trim()) {
      alert(`Message to ${selectedStudent}: ${message}`);
      setMessage("");
    }
  };

  return (
    <div className="p-4">

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-6">

        {/* Students List */}
        <div className="w-full md:w-1/4">
          <h2 className="font-bold mb-4">List of Students</h2>
          <div className="space-y-2">
            {students.map((student) => (
              <button
                key={student}
                onClick={() => setSelectedStudent(student)}
                className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-left"
              >
                {student}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="flex-1 bg-gray-800 shadow-md p-6 flex flex-col rounded-lg h-[300px]">
          <p className="mb-4">Chatting with <strong>{selectedStudent}</strong>...</p>

          <div className="bg-green-500 text-white px-4 py-2 rounded mb-4 text-right">
            Salam Alykoum
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 rounded bg-gray-700 placeholder-gray-400 text-white"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend} className="bg-green-600 px-4 py-2 rounded">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
