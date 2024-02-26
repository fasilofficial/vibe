"use client";

import UserLayout from "@/app/(components)/UserLayout";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import toast, { Toaster } from "react-hot-toast";
import { useAddReportMutation } from "@/app/(redux)/slices/report/reportApiSlice";
import { useGetPostMutation } from "@/app/(redux)/slices/post/postApiSlice";

const page = ({ params: { postId } }) => {
  const [post, setPosts] = useState();
  const [formData, setFormData] = useState({});

  const router = useRouter();

  const { userInfo } = useSelector((state) => state.auth);

  const [addReport] = useAddReportMutation();
  const [getPost] = useGetPostMutation();

  const handleChange = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData((prevState) => ({ ...prevState, [key]: value }));
  };

  const handleReportSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const res = await addReport({
        reportDescription: formData.reportDescription,
        postId,
        userId: userInfo._id,
      }).unwrap();

      toast.success(res?.message);

      formData.setReportDescription = "";

      setTimeout(() => router.push("/"), 500);
    },
    [formData.reportDescription, post]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPost(postId).unwrap();

      setPosts(res);
    };

    fetchPosts();
  }, []);

  return (
    <UserLayout>
      <div className="py-4 flex justify-center">
        <Toaster />
        <div className="max-w-md bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl report-post">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <img
                className="h-48 w-full object-cover md:w-48"
                src={post?.imageUrl}
                alt="Post"
              />
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                Post ID: {postId}
              </div>
              <div className="mt-2 text-gray-600">{post?.caption}</div>
              <form onSubmit={handleReportSubmit}>
                <input
                  className="mt-4 border rounded-md p-2 w-full"
                  value={formData.reportDescription}
                  name="reportDescription"
                  onChange={handleChange}
                  placeholder="Enter report description"
                />
                <button
                  type="submit"
                  className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Report
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default page;
