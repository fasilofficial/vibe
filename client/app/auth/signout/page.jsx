"use client";

import { logout } from "@/app/(redux)/slices/auth/authSlice";
import { removePosts } from "@/app/(redux)/slices/data/dataSlice";
import { useLogoutMutation } from "@/app/(redux)/slices/user/userApiSlice";
import { useRouter } from "next/navigation";
import React from "react";

import toast, { Toaster } from "react-hot-toast";

import { useDispatch } from "react-redux";

const AdminSignOut = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [logoutMutation] = useLogoutMutation();

  const handleSignout = async () => {
    const res = await logoutMutation().unwrap();

    dispatch(logout());
    dispatch(removePosts())

    toast("Redirecting to sign in page");

    setTimeout(() => {
      router.push("/auth/signin");
    }, 500);
  };

  return (
    <div className="p-6 border rounded-md flex flex-col shadow-md items-center">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Sign Out</h1>
      <p className="mb-4">Are you sure you want to sign out?</p>
      <button
        type="button"
        onClick={handleSignout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded"
      >
        Sign Out
      </button>
    </div>
  );
};

export default AdminSignOut;
