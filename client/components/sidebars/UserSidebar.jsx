"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  FaCompass,
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaUser,
} from "react-icons/fa";
import { FaMessage } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Badge from "@mui/material/Badge";
import { useSocket } from "@/providers/SocketProvider";
import { NOTIFICATION_TYPES } from "@/constants";

const UserSidebar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const pathname = usePathname();

  const socket = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [messageNotifications, setMessageNotifications] = useState([]);

  useEffect(() => {
    socket?.on("receiveNotification", (data) => {

      if (data.senderName !== userInfo?.username) {
        if (data.type === NOTIFICATION_TYPES.message && pathname !== '/chat') {
          setMessageNotifications((prevState) => [...prevState, data]);
        } else {
          setNotifications((prevState) => [...prevState, data]);
        }
      }
    });
  }, [socket]);

  return (
    <aside className="p-1 md:p-4 h-32 md:h-screen fixed bottom-0 w-full md:w-auto md:left-0">
      <div
        className={`bg-white dark:bg-gray-800 rounded-md h-full md:p-4 shadow-md flex md:flex-col  justify-between items-center`}
      >
        <Link href="/" className="hidden md:block text-3xl font-extrabold text-blue-800">
          VIBE.
        </Link>
        <div className="flex md:flex-col">
          <Tooltip id="item-tooltip" />
          {[
            { title: "Feed", icon: <FaHome />, path: "/" },
            { title: "Search", icon: <FaSearch />, path: "/search" },
            { title: "Explore", icon: <FaCompass />, path: "/explore" },
            {
              title: "Chat",
              icon: <FaMessage />,
              path: "/chat",
              badge:
                messageNotifications.length > 0
                  ? messageNotifications.length
                  : null,
            },
            {
              title: "Activities",
              icon: <IoIosNotifications />,
              path: "/activity",
              badge: notifications.length > 0 ? notifications.length : null,
            },
            { title: "New Post", icon: <FaPlusCircle />, path: "/add-post" },
          ].map((item, index) => (
            <Link
              data-tooltip-id="item-tooltip"
              data-tooltip-content={item.title}
              data-tooltip-place="right"
              data-tooltip-delay-show={1000}
              key={index}
              href={item.path}
              className={`w-10 h-10 md:w-14 md:h-14 rounded-full  flex items-center justify-center shadow-md mx-2 md:my-3 ${
                pathname == item.path
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 text-gray-900"
              } hover:shadow-xl hover:scale-105 transition-all`}
            >
              {item.badge ? (
                <Link
                  data-tooltip-id="item-tooltip"
                  data-tooltip-content={item.title}
                  data-tooltip-place="right"
                  data-tooltip-delay-show={1000}
                  key={index}
                  href={item.path}
                  className={`w-14 h-14 rounded-full  flex items-center justify-center shadow-md my-3 ${
                    pathname == item.path
                      ? "bg-blue-800 text-white"
                      : "bg-gray-100 text-gray-900"
                  } hover:shadow-xl hover:scale-105 transition-all`}
                >
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="primary">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </Link>
              ) : (
                item.icon
              )}
            </Link>
          ))}
        </div>
        <div className="flex md:flex-col">
          {[
            { title: "Profile", icon: <FaUser />, path: "/profile" },
            { title: "Logout", icon: <IoLogOut />, path: "/auth/signout" },
          ].map((item, index) => (
            <Link
              data-tooltip-id="item-tooltip"
              data-tooltip-content={item.title}
              data-tooltip-place="right"
              data-tooltip-delay-show={1000}
              key={index}
              href={item.path}
              className={`w-10 h-10 md:h-14 md:w-14 rounded-full  flex items-center justify-center shadow-md mx-2 md:my-3 ${
                pathname == item.path
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 text-gray-900"
              } hover:shadow-xl hover:scale-105 transition-all`}
            >
              {item.path === "/profile" && userInfo?.profileUrl ? (
                <img
                  src={userInfo?.profileUrl}
                  className="w-full h-full rounded-full object-cover "
                />
              ) : (
                item.icon
              )}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default UserSidebar;
