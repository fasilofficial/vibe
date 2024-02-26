"use client";

import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";

const Suggestions = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="p-4 w-80 fixed right-0 ">
      <div className="bg-white dark:bg-gray-800 p-4">
        {userInfo?.profileUrl && (
          <div className="flex flex-col gap-4">
            <img
              src={userInfo?.profileUrl}
              className="w-48 h-48 mx-auto rounded-full object-cover"
            />
            <Link
              href="/profile"
              className="p-2 mb-4 rounded bg-blue-500 text-white text-center"
            >
              View Profile
            </Link>
          </div>
        )}

        <div className="p-4 pr-8 dark:bg-gray-800 shadow-md rounded flex flex-col gap-4">
          <h1>People you may know</h1>
          <div>
            {[
              { username: "someone123", icon: "S" },
              { username: "ajzalbyte", icon: "A" },
            ].map((user, index) => {
              return (
                <div key={index} className="mb-2 flex gap-2 items-center">
                  <div className="w-12 h-12 rounded-full border-gray-400 border flex justify-center items-center">
                    <h2 className="">{user.icon}</h2>
                  </div>
                  <div className="flex flex-col">
                    <h1>{user.username}</h1>
                    <h3 className="text-blue-700 cursor-pointer hover:text-blue-600 ">
                      Follow
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
