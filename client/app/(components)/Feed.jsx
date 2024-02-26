"use client";

import React, { useEffect, useState } from "react";
import Post from "./Post";
import { useGetPostsMutation } from "../(redux)/slices/post/postApiSlice";

const Feed = () => {
  const [posts, setPosts] = useState();

  const [getPosts] = useGetPostsMutation();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts().unwrap();

      setPosts(res);
    };

    fetchPosts();
  }, []);

  return (
    <div className="w-4/6 ml-36 py-4">
      <div className="flex flex-col items-center gap-6">
        {posts
          ? posts.map((post, index) => (
              <Post key={post._id || index} post={post} />
            ))
          : "Fetching posts..."}
      </div>
    </div>
  );
};

export default Feed;
