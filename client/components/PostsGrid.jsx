"use client";

import React, { useEffect, useState } from "react";
import ExplorePost from "./ExplorePost";
import { useGetPostsMutation } from "../redux/slices/post/postApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { setPosts } from "../redux/slices/data/dataSlice";

const PostsGrid = () => {
  const { posts } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  const [getPosts] = useGetPostsMutation();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts().unwrap();
      dispatch(setPosts(res));
    };

    if (!posts) {
      fetchPosts();
    }
  }, []);

  return (
    <div className="w-4/6 flex justify-center items-center ml-36 my-4 ">
      <div className="w-full grid grid-cols-4 gap-4 ">
        {posts ? (
          posts.map((post, index) => (
            <ExplorePost
              key={index}
              post={post}
              first={index === 0 ? true : false}
            />
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default PostsGrid;
