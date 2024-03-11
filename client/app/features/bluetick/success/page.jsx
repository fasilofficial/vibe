"use client";

import { updateUser } from "@/redux/slices/data/dataSlice";
import { useAddBluetickMutation } from "@/redux/slices/user/userApiSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");
  const [showContent, setShowContent] = useState(false);

  const [addBluetick] = useAddBluetickMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userId || !type) router.push("/profile");
    else {
      setShowContent(true);

      const handleAddBluetick = async () => {
        try {
          const res = await addBluetick({ userId, type }).unwrap();

          if (res.data) {
            dispatch(updateUser({ userId, updatedUser: res.data }));
            router.push("/profile");
          }
        } catch (error) {
          console.error("Error adding bluetick", error);
        }
      };

      handleAddBluetick();
    }
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {userId && type ? (
        <div className="p-4 rounded-md shadow-md flex items-center flex-col">
          <h1 className="mb-4 text-2xl">Purchase Success.</h1>
          <h2>Redirecting back to profile page</h2>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default page;
