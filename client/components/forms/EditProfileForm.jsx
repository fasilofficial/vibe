"use client";

import {
  useEditUserMutation,
  useToggleAccountTypeMutation,
} from "@/redux/slices/user/userApiSlice";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { updateUser } from "@/redux/slices/data/dataSlice";
import { selectUser } from "@/redux/selectors";
import Link from "next/link";

const EditProfileForm = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo?._id));

  const router = useRouter();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});

  const [image, setImage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const [editUser] = useEditUserMutation();
  const [toggleAccountType] = useToggleAccountTypeMutation();

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
        userId: user._id,
        ...formData,
      }).unwrap();

      if (res.data) {
        dispatch(updateUser({ userId: user._id, updatedUser: res.data }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    } finally {
      setIsLoading(false);
      router.push("/profile");
    }
  };

  const handlePrivateAccount = async (e) => {
    try {
      const res = await toggleAccountType(user?._id).unwrap();

      if (res.data) {
        dispatch(updateUser({ userId: user?._id, updatedUser: res.data }));
      }
    } catch (error) {
      console.error("Error toggling account type", error);
    }
  };

  useEffect(() => {
    setFormData({
      name: user?.name,
      username: user?.username,
      profileUrl: user?.profileUrl,
    });
  }, [user]);

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
      <div className="w-full p-6 my-4 rounded-md shadow-md">
        <h1 className="font-bold mb-2">Account Type</h1>
        <form action="" className="flex gap-2 item-center">
          <label htmlFor="private">Private account</label>
          <input
            type="checkbox"
            id="private"
            checked={user?.private}
            onChange={handlePrivateAccount}
          />
        </form>
      </div>
      <Link
        href="/profile"
        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-300"
      >
        Back
      </Link>
    </div>
  );
};

export default EditProfileForm;
