"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { getProviders, signIn } from "next-auth/react";
import validateForm from "@/app/(utils)/validate-form";
import { MutatingDots } from "react-loader-spinner";
import { usePathname, useRouter } from "next/navigation";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useSigninMutation } from "@/app/(redux)/slices/user/userApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/(redux)/slices/auth/authSlice";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const [signinMutation] = useSigninMutation();

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
        const result = await signinMutation(formData).unwrap();

        dispatch(setCredentials(result));
        router.push("/");
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
      <Toaster />
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
          <div className="mt-4">
            Forgot password?{" "}
            <Link href="/auth/forgotPassword" className="text-blue-500">
              Click
            </Link>
          </div>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            type="button"
            onClick={handleSubmit}
          >
            Signin
          </button>
        </form>
        {/* <div className="w-full flex items-center justify-center my-2">
          <hr className="w-full border-gray-400" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="w-full border-gray-400" />
        </div>
        <div className="flex items-center flex-col my-3">
          {providers &&
            Object.values(providers).map((provider) => {
              return (
                provider.id !== "credentials" && (
                  <div key={provider.name} style={{ marginBottom: "0.5rem" }}>
                    <button
                      className="flex items-center bg-gray-200 text-gray-800 py-2 px-8 rounded-md hover:bg-gray-300 transition-colors duration-300"
                      onClick={() => signIn(provider.id)}
                    >
                      {provider.id === "google" && (
                        <FaGoogle className="mr-2" />
                      )}
                      {provider.id === "github" && (
                        <FaGithub className="mr-2" />
                      )}
                      Sign in with {provider.name}
                    </button>
                  </div>
                )
              );
            })}
        </div> */}
        <div className="mt-4">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-blue-500">
            Signup
          </Link>
        </div>
      </div>
    </>
  );
};

export default SigninForm;
