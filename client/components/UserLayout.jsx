"use client";

import React, { useEffect } from "react";
import UserSidebar from "./sidebars/UserSidebar";
import Suggestions from "./Suggestions";
import ToggleTheme from "./ToggleTheme";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import { SocketProvider } from "@/providers/SocketProvider";

const UserLayout = ({ children, socket }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

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
