"use client";

import {
  useEditUserMutation,
  useGetUserMutation,
} from "@/app/(redux)/slices/user/userApiSlice";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { setCredentials } from "@/app/(redux)/slices/auth/authSlice";

const EditProfileForm = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: userInfo?.name,
    username: userInfo?.username,
    profileUrl: userInfo?.profileUrl,
  });

  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [editUser] = useEditUserMutation();

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async () => {
    for (const key in formData) {
      if (!formData[key]) {
        return toast.error("All fields are required");
      }
    }

    setIsLoading(true);

    if (image) {
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
    }

    try {
      const res = await editUser({
        userId: userInfo._id,
        ...formData,
      }).unwrap();

      dispatch(setCredentials(res.data));
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    } finally {
      setIsLoading(false);
      router.push("/profile");
    }
  };

  return (
    <div className="ml-36 my-4 max-w-6xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Edit Profile</h2>
      <div className="p-6 rounded-md shadow-md">
        <form className="space-y-4">
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
            >
              Profile Image:
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="appearance-none border rounded w-full h-34 object-cover py-2 px-3 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
            />

            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : formData.profileUrl
                  ? formData.profileUrl
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

          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            type="button"
            onClick={handleSubmit}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileForm;
