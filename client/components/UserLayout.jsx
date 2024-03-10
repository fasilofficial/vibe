"use client";

import React, { useEffect } from "react";
import UserSidebar from "./sidebars/UserSidebar";
// import { options } from "../api/auth/[...nextauth]/options";
// import { getServerSession } from "next-auth";
import Suggestions from "./Suggestions";
import ToggleTheme from "./ToggleTheme";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Loader from "./Loader";

const UserLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (!userInfo) router.push("/auth/signin");
  });

  if (userInfo) {
    return (
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
    );
  } else {
    return <Loader />;
  }
};

export default UserLayout;
