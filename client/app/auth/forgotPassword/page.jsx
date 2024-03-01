"use client";

import React, { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { IoEye, IoEyeOff } from "react-icons/io5";

import Link from "next/link";
import validateForm from "@/app/(utils)/validate-form";
import { useRouter } from "next/navigation";
import {
  useForgotPasswordMutation,
  useSendOtpMutation,
} from "@/app/(redux)/slices/user/userApiSlice";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    emailVerified: false,
    password: "",
  });
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState();
  const [generatedOtp, setGeneratedOtp] = useState();
  const [showPassword, setShowPassword] = useState();

  const router = useRouter();

  const emailRef = useRef();

  const [forgotPassword] = useForgotPasswordMutation();
  const [sendOtp] = useSendOtpMutation();

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleSendOtp = async () => {
    const email = emailRef.current.value;

    if (!email) return toast.error("Enter your email");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setOtpSending(true);

    try {
      const res = await sendOtp({ email, forgotPassword: true }).unwrap();

      toast.success(res.message);
      setGeneratedOtp(res.otp);
      setOtpSending(false);
    } catch (error) {
      setOtpSending(false)
      console.log("error:", error);
      toast.error(error?.data?.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!generatedOtp) return toast.error("Please enter the mail to get OTP");
    if (!enteredOtp) return toast.error("Please enter the OTP");

    setOtpVerifying(true);

    if (
      enteredOtp.length &&
      generatedOtp.length &&
      enteredOtp === generatedOtp
    ) {
      toast.success("Email verified successfully");
      formData.emailVerified = true;
      setOtpVerifying(false);
    } else {
      toast.error("Invalid OTP. Please try again");
    }
  };

  const handleSubmit = async () => {
    try {
      if (validateForm(formData, true)) {
        const res = await forgotPassword({
          email: formData.email,
          newPassword: formData.password,
        }).unwrap();

        toast.success(res.message);

        setTimeout(() => router.push("/auth/signin"), 500);
      }
    } catch (error) {
      console.log(error?.message || error?.data?.message);
      toast.error(error?.message || error?.data?.message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-500">
          Forgot Password
        </h2>
        <form className="space-y-4">
          <div className="w-full p-2 border border-gray-300 bg-white rounded-md flex justify-between">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              ref={emailRef}
              className="focus:outline-none focus:border-gray-500"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-blue-500"
            >
              {otpSending ? "Sending..." : "Send OTP"}
            </button>
          </div>
          <div className="w-full p-2 border border-gray-300 bg-white rounded-md flex justify-between">
            <input
              type="text"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="OTP"
              className="focus:outline-none focus:border-gray-500"
            />
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="text-blue-500"
            >
              {otpVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1 flex justify-between px-4 py-2 bg-white border border-gray-300 rounded-md focus:border-gray-500">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="outline-none"
              />
              <button
                type="button"
                className="p-1"
                onClick={() => setShowPassword((prevState) => !prevState)}
              >
                {showPassword ? <IoEyeOff /> : <IoEye />}
              </button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
              href="/auth/signin"
            >
              Cancel
            </Link>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
              type="button"
              onClick={handleSubmit}
            >
              Change Password
            </button>
          </div>
        </form>
        {/* <div className="mt-4">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-500">
            Signup
          </Link>
        </div> */}
      </div>
    </>
  );
};

export default ForgotPassword;
