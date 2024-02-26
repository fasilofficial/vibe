"use client";

import { useGetUserMutation } from "@/app/(redux)/slices/user/userApiSlice";
import React, { useState, useEffect } from "react";
import { useSelector, useReducer } from "react-redux";

const EditProfileForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    profileUrl: "",
  });
  const { userInfo } = useSelector((state) => state.auth);

  const [getUser] = useGetUserMutation();

  useEffect(async () => {
    const fetchUserData = async () => {
      const res = await getUser().unwrap();
    };

    fetchUserData();
  }, [userInfo]);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  return <div>EditProfileForm</div>;
};

export default EditProfileForm;
