"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import { getProviders, signIn } from "next-auth/react";
import validateForm from "@/app/(utils)/validate-form";
import { MutatingDots } from "react-loader-spinner";
import { usePathname, useRouter } from "next/navigation";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "@/app/(redux)/slices/auth/authSlice";
import { useAdminSigninMutation } from "@/app/(redux)/slices/admin/adminApiSlice";

const AdminSigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [signinMutation] = useAdminSigninMutation();

  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders);
      setLoading(false);
    };

    fetchProviders();
  }, []);

  const pathname = usePathname();

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (validateForm(formData)) {
        const res = await signinMutation(formData).unwrap();

        dispatch(setAdminCredentials(res));
        router.push("/admin");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.message);
      console.log(error);
    }
  };

  if (loading) {
    return (
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#3B82F6"
        secondaryColor="#3B82F6"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
      />
    );
  }

  return (
    <>
      <div className="p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-500">Signin</h2>
        <form className="space-y-4">
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          />
          <div className="w-full flex justify-between px-4 py-2 border bg-white border-gray-300 rounded-md focus:border-gray-500">
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
              onClick={() => setShowPassword((prevState) => !prevState)}
              className="p-1"
            >
              {showPassword ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            type="button"
            onClick={handleSubmit}
          >
            Signin
          </button>
        </form>
        <div className="mt-4">
          Don't have an account?{" "}
          <Link href="/auth/admin/signup" className="text-blue-500">
            Signup
          </Link>
        </div>
      </div>
    </>
  );
};

export default AdminSigninForm;
