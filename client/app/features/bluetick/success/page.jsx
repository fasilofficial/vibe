"use client";

import { updateUser } from "@/redux/slices/data/dataSlice";
import { useAddBluetickMutation } from "@/redux/slices/user/userApiSlice";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

const page = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const type = searchParams.get("type");

  const [addBluetick] = useAddBluetickMutation();

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userId || !type) return;

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
  }, []);

  return (
    <div className="text-green-500 text-2xl ">
      success page, redicting to profile page
    </div>
  );
};

export default page;
