"use client";

import React, { useEffect, useState } from "react";
import UserSidebar from "./sidebars/UserSidebar";
import Suggestions from "./Suggestions";
import ToggleTheme from "./ToggleTheme";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { SocketProvider } from "@/providers/SocketProvider";
import { io } from "socket.io-client";

export const handleSendNotification = (socket, type, senderName, receiverName) => {
  socket.emit("sendNotification", { type, senderName, receiverName });
};

const UserLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [socket, setSocket] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setSocket(io("http://localhost:3300"));
  }, []);

  useEffect(() => {
    socket?.emit("newUser", userInfo?.username);
  }, [userInfo, socket]);

  useEffect(() => {
    if (!userInfo) router.push("/auth/signin");
  });

  if (userInfo) {
    return (
      <SocketProvider socket={socket}>
        <div className="flex w-full justify-between h-screen">
          <div className="relative">
            <UserSidebar />
          </div>
          <div className="w-full ">{children}</div>
          <div className="relative">
            <Suggestions />
            <ToggleTheme />
          </div>
        </div>
      </SocketProvider>
    );
  } else {
    return <Loader />;
  }
};

export default UserLayout;
