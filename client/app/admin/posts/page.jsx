"use client";

import { useGetPostsMutation } from "@/app/(redux)/slices/admin/adminApiSlice";
import { setPosts } from "@/app/(redux)/slices/data/dataSlice";
import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";

const Posts = () => {
  const { posts } = useSelector((state) => state.data);
  const [getPosts, { isLoading, error }] = useGetPostsMutation();

  const dispatch = useDispatch();

  const fetchPosts = async () => {
    if (!posts) {
      const res = await getPosts().unwrap();
      dispatch(setPosts(res));
    }
  };

 

  useEffect(() => {
    fetchPosts();
  }, [posts]);



  return (
    <div>
      <h1>Posts</h1>
      {posts ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700  shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={post.imageUrl}
                alt="Post"
                className="w-full h-40 object-cover object-center"
              />

              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{post.location}</p>
                <p className="text-gray-600 dark:text-gray-300 mb-2">Post by: {post.creator.username}</p>
                <div className="flex flex-wrap mb-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 text-sm rounded-full px-2 py-1 mr-1 mb-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

export default Posts;
