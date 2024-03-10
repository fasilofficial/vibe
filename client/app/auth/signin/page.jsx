"use client";

import Loader from "@/components/Loader";
import SigninForm from "@/components/forms/SigninForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Signin = async () => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (userInfo) router.push("/");
  }, []);

  if (!userInfo) {
    return (
      <div className="p-4 max-w-md ">
        <SigninForm />
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Signin;
