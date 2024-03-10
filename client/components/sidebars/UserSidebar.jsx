"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import React from "react";
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
import { useLogoutMutation } from "@/redux/slices/user/userApiSlice";

const UserSidebar = ({ session }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const pathname = usePathname();

  return (
    <aside className="p-4 h-screen fixed left-0">
      <div
        className={`bg-white dark:bg-gray-800 rounded-md h-full p-4 shadow-md flex flex-col justify-between items-center`}
      >
        <Link href="/" className="text-3xl font-extrabold text-blue-800">
          VIBE.
        </Link>
        <div>
          <Tooltip id="item-tooltip" />
          {[
            { title: "Feed", icon: <FaHome />, path: "/" },
            { title: "Search", icon: <FaSearch />, path: "/search" },
            { title: "Explore", icon: <FaCompass />, path: "/explore" },
            { title: "Chat", icon: <FaMessage />, path: "/chat" },
            {
              title: "Activities",
              icon: <IoIosNotifications />,
              path: "/activity",
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
              className={`w-14 h-14 rounded-full  flex items-center justify-center shadow-md my-3 ${
                pathname == item.path
                  ? "bg-blue-800 text-white"
                  : "bg-gray-100 text-gray-900"
              } hover:shadow-xl hover:scale-105 transition-all`}
            >
              {item.icon}
            </Link>
          ))}
        </div>
        <div>
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
              className={`w-14 h-14 rounded-full  flex items-center justify-center shadow-md my-3 ${
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
