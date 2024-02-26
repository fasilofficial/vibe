"use client";

import React from "react";
import Link from "next/link";

import { useSelector } from "react-redux";
import UserLayout from "./UserLayout";
import Feed from "./Feed";

const HomeContent = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      {!userInfo ? (
        <div className="w-screen h-screen relative">
          <div className=" absolute inset-0 flex items-center flex-col justify-center ">
            <h1 className=" text-8xl font-extrabold mb-4">VIBE.</h1>
            <Link
              href="/api/auth/signin"
              className="bg-white bg-opacity-50 hover:bg-opacity-40 hover:scale-105 transition-all hover:shadow-sm duration-300 px-6 py-2 rounded text-xl"
            >
              Get Started!
            </Link>
          </div>
          <img
            src="https://images.hdqwalls.com/wallpapers/color-blur-abstract-4k-73.jpg"
            className="w-full h-full object-cover "
          />
        </div>
      ) : (
        <UserLayout>
          <Feed  />
        </UserLayout>
      )}
    </>
  );
};

export default HomeContent;
