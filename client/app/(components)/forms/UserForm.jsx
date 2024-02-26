"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
const UserForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const res = await fetch("/api/Users", {
      method: "POST",
      body: JSON.stringify({ formData }),
      "Content-Type": "application/json",
    });

    if (!res.ok) {
      const response = await res.json();
      setErrorMessage(response.message);
    } else {
      router.refresh();
      router.push("/");
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="flex flex-col gap-3 w-5/6 "
      >
        <h1>Create New User</h1>
        <hr />
        <p className="mb-6">Only admin can access this page</p>
        <div>
          <label>Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            onChange={handleChange}
            value={formData.name}
            className="my-2 p-1 border border-slate-200 focus:outline-slate-400 rounded"
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            id="email"
            name="email"
            type="text"
            onChange={handleChange}
            value={formData.email}
            className="my-2 p-1 border border-slate-200 focus:outline-slate-400 rounded"
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            className="my-2 p-1 border border-slate-200 focus:outline-slate-400 rounded"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 transition-all p-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
      <p className="text-red-500">{errorMessage}</p>
    </>
  );
};

export default UserForm;
