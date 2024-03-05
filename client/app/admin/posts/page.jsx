"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, removePost } from "@/app/(redux)/slices/data/dataSlice";

import {
  useGetPostsMutation,
  useDeletePostMutation,
} from "@/app/(redux)/slices/post/postApiSlice";

const Posts = () => {
  const { posts } = useSelector((state) => state.data);

  const [getPosts, { isLoading: isLoadingGetPosts, error: errorGetPosts }] =
    useGetPostsMutation();

  const [deletePost] = useDeletePostMutation();

  const dispatch = useDispatch();

  const handleDeletePost = async (postId) => {
    try {
      const res = await deletePost(postId).unwrap();

      if (res.data) {
        dispatch(removePost(postId));
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts().unwrap();
        if (res.data) {
          dispatch(setPosts(res.data));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Post Management</h1>
      {isLoadingGetPosts ? (
        "Loading..."
      ) : errorGetPosts ? (
        <div>Error loading posts: {errorGetPosts.message}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-40 object-cover object-center"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{post.caption}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-1">
                    Location: {post.location}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Post by: {post.creator.username}
                  </p>
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
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No posts available.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Posts;
