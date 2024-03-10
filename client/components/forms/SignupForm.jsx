"use client";

import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import validateForm from "@/utils/validate-form";
import {
  useSendOtpMutation,
  useSignupMutation,
} from "@/redux/slices/user/userApiSlice";

import { IoEye, IoEyeOff } from "react-icons/io5";
import { setCredentials } from "@/redux/slices/auth/authSlice";

import { useDispatch } from "react-redux";

const SignupForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const [generatedOtp, setGeneratedOtp] = useState();
  const [enteredOtp, setEnteredOtp] = useState();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    confirmPassword: "",
    emailVerified: false,
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.value;
    const key = e.target.name;
    if (key === "email") {
      formData.emailVerified = false;
      setTimer();
    }
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const [signup, { isLoading }] = useSignupMutation();

  const [image, setImage] = useState();
  const [timer, setTimer] = useState();

  const [sentOtpDisabled, setSentOtpDisabled] = useState(false);

  const emailRef = useRef();

  const [sendOtp] = useSendOtpMutation();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSendOtp = async () => {
    const email = emailRef.current.value;

    if (!email) return toast.error("Enter your email");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    try {
      setOtpSending(true);
      setTimer();

      const res = await sendOtp({ email }).unwrap();

      toast.success(res.message);
      setGeneratedOtp(res.otp);
      setOtpSending(false);
      setSentOtpDisabled(true);

      function startTimer() {
        const duration = 1 * 60 * 1000;

        const startTime = Date.now();

        const timerInterval = setInterval(() => {
          const currentTime = Date.now();

          const remainingTime = duration - (currentTime - startTime);

          if (remainingTime <= 0) {
            clearInterval(timerInterval);
            setTimer("OTP Expired");
          } else {
            const minutes = Math.floor(
              (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
            );
            let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            if (seconds < 10) seconds = "0" + seconds;

            setTimer(`${minutes}:${seconds}`);
          }
        }, 1000);
      }

      startTimer();

      setTimeout(() => {
        toast("OTP expired. Click send OTP button again");
        setSentOtpDisabled(false);
        setGeneratedOtp();
      }, 1 * 60 * 1000); // 2 minutes
    } catch (error) {
      setOtpSending(false);
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
      setTimer();
    } else {
      toast.error("Invalid OTP. Please try again");
    }
    setOtpVerifying(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm(formData, true)) {
        // setLoading(true);

        if (!image) return toast.error("All fields are required");

        const imageData = new FormData();
        imageData.append("file", image);
        imageData.append("upload_preset", "z0o48jjp");
        imageData.append("cloud_name", "fasils");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/fasils/image/upload",
          {
            method: "POST",
            body: imageData,
          }
        );

        const data = await response.json();

        const profileUrl = data.secure_url;

        formData.profileUrl = profileUrl;

        const result = await signup(formData).unwrap();

        dispatch(setCredentials(result));

        router.refresh();
        router.push("/");
      }
    } catch (error) {
      toast.error(error?.message || error?.data?.message);
    }
  };

  return (
    <div className="p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label
            htmlFor="image"
            className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
          >
            Image:
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
          />

          <img
            src={
              image
                ? URL.createObjectURL(image)
                : "https://t3.ftcdn.net/jpg/02/48/42/64/360_F_248426448_NVKLywWqArG2ADUxDq6QprtIzsF82dMF.jpg"
            }
            alt="Selected"
            className="mt-2"
            style={{ maxWidth: "200px", maxHeight: "200px" }}
          />
        </div>

        <input
          type="text"
          name="name"
          value={formData?.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />

        <input
          type="text"
          name="username"
          value={formData?.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />
        <div className="w-full p-2 border border-gray-300 bg-white rounded-md flex justify-between">
          <input
            type="text"
            name="email"
            value={formData?.email}
            onChange={handleChange}
            placeholder="Email"
            ref={emailRef}
            className="focus:outline-none focus:border-gray-500 w-5/6"
          />
          <button
            type="button"
            onClick={handleSendOtp}
            className="text-blue-500"
            disabled={sentOtpDisabled ? true : false}
          >
            {otpSending ? "Sending..." : "Send OTP"}
          </button>
        </div>
        <div className="w-full p-2 border border-gray-300 bg-white rounded-md flex justify-between">
          <input
            type="text"
            name="email"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            placeholder="OTP"
            className="focus:outline-none focus:border-gray-500 w-5/6"
          />
          <button
            type="button"
            onClick={handleVerifyOtp}
            className="text-blue-500"
          >
            {otpVerifying ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
        {timer && <h1 className=" text-right ">{timer}</h1>}
        <input
          type="date"
          name="dob"
          value={formData?.dob}
          onChange={handleChange}
          placeholder="Date of Birth"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
        />
        <div className="flex space-x-4">
          <div className="flex-1 flex justify-between px-4 py-2 bg-white border border-gray-300 rounded-md focus:border-gray-500">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData?.password}
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
          <div className="flex-1 flex justify-between px-4 py-2 bg-white border border-gray-300 rounded-md focus:border-gray-500">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData?.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="outline-none"
            />
            <button
              type="button"
              className="p-1"
              onClick={() => setShowConfirmPassword((prevState) => !prevState)}
            >
              {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
        </div>
        <div>
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-blue-500">
            Signin
          </Link>
        </div>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
          type="submit"
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
