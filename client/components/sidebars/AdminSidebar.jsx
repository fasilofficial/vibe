"use client";

import React from "react";
import Link from "next/link";

import { IoIosPeople } from "react-icons/io";
import { IoSettings, IoLogOut } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { TiDocumentText } from "react-icons/ti";
import { usePathname } from "next/navigation";
import { GoReport } from "react-icons/go";

const AdminSidebar = ({ adminInfo }) => {
  const pathname = usePathname();

  return (
    <aside className="h-screen min-w-56 bg-white dark:bg-gray-900 shadow-2xl flex flex-col justify-between p-4 ">
      <div>
        <h1 className="text-3xl font-extrabold text-center text-blue-500 mb-8">
          VIBE.
        </h1>
        <div className="flex flex-col gap-2  ">
          {[
            {
              title: "dashboard",
              route: "/admin",
              icon: <MdSpaceDashboard />,
            },
            {
              title: "users",
              route: "/admin/users",
              icon: <IoIosPeople />,
            },
            {
              title: "posts",
              route: "/admin/posts",
              icon: <TiDocumentText />,
            },
            {
              title: "reports",
              route: "/admin/reports",
              icon: <GoReport />,
            },
          ].map((item, index) => {
            return (
              <Link
                key={index}
                className={`flex gap-4 items-center p-4 rounded-md hover:text-gray-600 dark:hover:text-white/80 transition-all ${
                  item.route == pathname ? "bg-blue-500 text-white" : ""
                }`}
                href={item.route}
              >
                <div className="w-8 h-8 flex justify-center items-center">
                  {item.icon}
                </div>
                <h2 className="capitalize">{item.title}</h2>
              </Link>
            );
          })}
        </div>
      </div>
      <div>
        {[
          {
            title: "profile",
            route: "/admin/profile",
            icon: <IoIosPeople />,
          },
          {
            title: "settings",
            route: "/admin/settings",
            icon: <IoSettings />,
          },
          {
            title: "logout",
            route: "/auth/admin/signout",
            icon: <IoLogOut />,
          },
        ].map((item, index) => {
          return (
            <Link
              key={index}
              className={`flex gap-4 items-center p-4 rounded-md hover:text-gray-600 dark:hover:text-white/80 transition-all ${
                item.route == pathname ? "bg-blue-500 text-white" : ""
              }`}
              href={item.route}
            >
              {item.route === "/admin/profile" ? (
                adminInfo?.profileUrl ? (
                  <img
                    src={adminInfo?.profileUrl}
                    className="w-8 h-8 rounded-full "
                  />
                ) : (
                  <div className="w-8 h-8 flex justify-center items-center">
                    {item.icon}
                  </div>
                )
              ) : (
                <div className="w-8 h-8 flex justify-center items-center">
                  {item.icon}
                </div>
              )}

              <h2 className="capitalize">{item.title}</h2>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;
