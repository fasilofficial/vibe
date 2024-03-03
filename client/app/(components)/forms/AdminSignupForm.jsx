"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import validateForm from "@/app/(utils)/validate-form";

import { IoEye, IoEyeOff } from "react-icons/io5";
import {
  setAdminCredentials,
  setCredentials,
} from "@/app/(redux)/slices/auth/authSlice";

import { useDispatch } from "react-redux";
import { useAdminSignupMutation } from "@/app/(redux)/slices/admin/adminApiSlice";

const AdminSignupForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const [adminSignup] = useAdminSignupMutation();

  const [image, setImage] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (validateForm(formData, true)) {
        // setLoading(true);

        if (!image) return toast.error("All fields are required");

        setIsLoading(true);

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

        const result = await adminSignup(formData).unwrap();

        dispatch(setAdminCredentials(result));

        router.refresh();
        router.push("/admin");
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
          name="email"
          value={formData?.email}
          onChange={handleChange}
          placeholder="Email"
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
          <Link href="/auth/admin/signin" className="text-blue-500">
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

export default AdminSignupForm;
