"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatPage = () => {
  const [socket, setSocket] = useState();
  const [inbox, setInbox] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSendMessage = () => {
    socket.emit("message", message, roomName);
  };

  const handleJoinRoom = () => {
    socket.emit("joinRoom", roomName);
  };

  useEffect(() => {
    const socket = io("http://localhost:3300");

    socket.on("message", (message) => {
      setInbox((prevState) => {
        if (!prevState.includes(message)) {
          return [...prevState, message];
        } else {
          return prevState;
        }
      });

      //   setInbox((prevState) => [...prevState, message]);
    });

    setSocket(socket);
  }, []);
  return (
    <div className="w-4/6 ml-36 mt-4">
      <div className="flex flex-col gap-4">
        <div>
          <h1>Messages</h1>
          <div className="flex flex-col gap-4 bg-white dark:bg-gray-800 min-h-96 p-2">
            {inbox.map((message, index) => (
              <div
                className="p-4 border border-b min-w-80 rounded-lg max-w-fit"
                key={index}
              >
                {message}
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              name="message"
              className="dark:bg-gray-700 p-2 rounded-sm"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-md cursor-pointer border-black bg-blue-500"
              type="button"
            >
              Send
            </button>
          </div>
          <div className="flex gap-4">
            <input
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              type="text"
              name="room"
              className="dark:bg-gray-700 p-2 rounded-sm"
            />
            <button
              onClick={handleJoinRoom}
              className="p-2 rounded-md cursor-pointer border-black bg-blue-500"
              type="button"
            >
              Join room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
