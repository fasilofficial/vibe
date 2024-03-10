"use client";

import Loader from "@/components/Loader";
import AdminSignupForm from "@/components/forms/AdminSignupForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Signup = () => {
  const { adminInfo } = useSelector((state) => state.auth);

  const router = useRouter();

  useEffect(() => {
    if (adminInfo) router.push("/admin");
  }, []);

  if (!adminInfo) {
    return (
      <div className="mx-w-1/2 p-4">
        <AdminSignupForm />
      </div>
    );
  } else {
    return <Loader />;
  }
};

export default Signup;
