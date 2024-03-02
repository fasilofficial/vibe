"use client";

import React, { useEffect, useState } from "react";
import Post from "./Post";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useGetPostsMutation,
  useLikePostMutation,
} from "../(redux)/slices/post/postApiSlice";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [getPosts] = useGetPostsMutation();
  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts().unwrap();
      setPosts(res);
    };
    fetchPosts();
  }, [getPosts]);

  const handleLike = async (postId, userId, setLiked) => {
    try {
      const res = await likePost({
        postId,
        userId,
      });

      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id === postId) {
            if (!post.likes.includes(userId)) {
              return {
                ...post,
                likes: [...post.likes, userId],
              };
            } else {
              const updatedLikes = post.likes.filter(
                (likeUserId) => likeUserId !== userId
              );
              return {
                ...post,
                likes: updatedLikes,
              };
            }
          }

          return post;
        });
      });

      setLiked((prev) => !prev); // toggle icon
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleAddComment = async (postId, userId, comment, setComment) => {
    if (comment.trim() === "") return;

    setComment("");

    try {
      const res = await addComment({
        comment,
        postId,
        userId,
      }).unwrap();

      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id === postId) {
            return { ...res.post };
          }

          return post;
        });
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await deleteComment({
        postId,
        commentId,
      }).unwrap();

      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id === postId) {
            return { ...res.post };
          }

          return post;
        });
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSavePost = async (postId) => {
    console.log("Save:", postId);
  };

  const handleReply = async (postId, commentId, reply) => {
    console.log(postId, commentId, reply);
  };

  return (
    <div className="w-4/6 ml-36 py-4">
      <div className="flex flex-col items-center gap-6">
        {posts
          ? posts.map((post, index) => (
              <Post
                key={post._id || index}
                post={post}
                handleLike={handleLike}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
                handleSavePost={handleSavePost}
                handleReply={handleReply}
              />
            ))
          : "Fetching posts..."}
      </div>
    </div>
  );
};

export default Feed;
