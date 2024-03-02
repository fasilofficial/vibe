"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post";
import {
  useAddCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
  useGetPostsMutation,
  useLikePostMutation,
} from "../(redux)/slices/post/postApiSlice";
import { useSavePostMutation } from "../(redux)/slices/user/userApiSlice";
import { setCredentials } from "../(redux)/slices/auth/authSlice";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});

  const { userInfo } = useSelector((state) => state.auth);
  const { posts: Posts } = useSelector((state) => state.data);

  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [addReply] = useAddReplyMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [savePost] = useSavePostMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  useEffect(() => {
    setPosts(Posts);
  }, [Posts]);

  const handleLike = async (postId, userId) => {
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
      
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleAddComment = async (postId, userId, comment, setComment) => {
    if (comment.trim() === "") return;

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

    setComment("");
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

  const handleAddReply = async (
    postId,
    commentId,
    userId,
    reply,
    setReply,
    setShowReplyInput
  ) => {
    try {
      const res = await addReply({ postId, commentId, userId, reply }).unwrap();

      setPosts((prevPosts) => {
        return prevPosts.map((post) => {
          if (post._id === postId) {
            return { ...res.post };
          }

          return post;
        });
      });
    } catch (error) {
      console.error("Error adding reply to comment:", error);
    }

    setReply("");
    setShowReplyInput(false);
  };

  const handleDeleteReply = async (postId, commentId, replyId) => {
    try {
      const res = await deleteReply({
        postId,
        commentId,
        replyId,
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
      console.error("Error deleting reply:", error);
    }
  };

  const handleSavePost = async (postId, userId) => {
    console.log("Save:", postId, userId);
    const res = await savePost({ postId, userId }).unwrap();
    setUser(res.user);
    dispatch(setCredentials(res.user));
  };

  return (
    <div className="w-4/6 ml-36 py-4">
      <div className="flex flex-col items-center gap-6">
        {posts
          ? posts.map((post, index) => (
              <Post
                key={post._id || index}
                post={post}
                user={user}
                handleLike={handleLike}
                handleAddComment={handleAddComment}
                handleDeleteComment={handleDeleteComment}
                handleSavePost={handleSavePost}
                handleAddReply={handleAddReply}
                handleDeleteReply={handleDeleteReply}
              />
            ))
          : "Fetching posts..."}
      </div>
    </div>
  );
};

export default Feed;
