"use client";

import React, { useEffect, useState } from "react";
import UserSidebar from "./sidebars/UserSidebar";
import Suggestions from "./Suggestions";
import ToggleTheme from "./ToggleTheme";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { useSocket } from "@/providers/SocketProvider";
import CallNotification from "./CallNotification";

export const handleSendNotification = (
  socket,
  type,
  senderName,
  receiverName
) => {
  socket.emit("sendNotification", { type, senderName, receiverName });
};

const UserLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const [receivingCall, setReceivingCall] = useState(false);
  const [name, setName] = useState("");
  const [caller, setCaller] = useState("");

  const socket = useSocket();
  const router = useRouter();

  useEffect(() => {
    socket?.emit("newUser", userInfo?.username);
  }, [userInfo, socket]);

  useEffect(() => {
    if (!userInfo) router.push("/auth/signin");
  }, []);

  const answerCall = () => {
    setReceivingCall(false);
    router.push("/chat/call");
  };

  const declineCall = () => {
    setReceivingCall(false);
    socket?.emit("declineCall", { to: caller });
  };

  useEffect(() => {
    socket?.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
    });

    socket?.on("callCanceled", () => {
      setReceivingCall(false);
      setCaller("");
      setName("");
    });
  }, [socket]);

  if (userInfo) {
    return (
      <div className="flex w-full justify-between h-screen">
        {receivingCall && (
          <CallNotification
            name={name}
            declineCall={declineCall}
            answerCall={answerCall}
          />
        )}
        <div className="relative">
          <UserSidebar />
        </div>
        <div className="w-full p-2 md:p-4">{children}</div>
        <div className="relative">
          <Suggestions />
          <ToggleTheme />
        </div>
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default UserLayout;
