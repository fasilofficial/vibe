"use client";

import Loader from "@/components/Loader";
import AdminSigninForm from "@/components/forms/AdminSigninForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Signin = async () => {
  const { adminInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (adminInfo) router.push("/admin");
  }, []);

  if (!adminInfo) {
    return (
      <div className="p-4 max-w-md ">
        <AdminSigninForm />
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Signin;
