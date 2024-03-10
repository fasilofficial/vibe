"use client";

import Loader from "@/components/Loader";
import SignupForm from "@/components/forms/SignupForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Signup = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (userInfo) router.push("/");
  }, []);

  if (!userInfo) {
    return (
      <div className="mx-w-1/2 p-4">
        <SignupForm />
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Signup;
