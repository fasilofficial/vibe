"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post";
import {
  useAddCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
  useDeleteReplyMutation,
  useGetPostsMutation,
  useLikePostMutation,
} from "../redux/slices/post/postApiSlice";
import {
  useGetUsersMutation,
  useSavePostMutation,
} from "../redux/slices/user/userApiSlice";

import {
  setPosts,
  setUsers,
  updateComments,
  updateLikes,
  updateSaves,
} from "../redux/slices/data/dataSlice";
import { selectUser } from "../redux/selectors";
import { NOTIFICATION_TYPES } from "@/constants";
import { useSocket } from "@/providers/SocketProvider";
import { handleSendNotification } from "./UserLayout";

const Feed = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo._id));
  const { posts } = useSelector((state) => state.data);
  const socket = useSocket();

  const [getPosts] = useGetPostsMutation();
  const [getUsers] = useGetUsersMutation();

  const [likePost] = useLikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [addReply] = useAddReplyMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [savePost] = useSavePostMutation();

  const dispatch = useDispatch();

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
    const fetchUsers = async () => {
      try {
        const res = await getUsers().unwrap();
        if (res.data) {
          dispatch(setUsers(res.data));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchPosts();
    fetchUsers();
    // if (!posts || posts?.length <= 0) fetchPosts();
    // if (!user) fetchUsers();
  }, []);

  const handleLike = async (
    { _id: postId, creator: { username: receiverName } },
    userId
  ) => {
    try {
      const res = await likePost({
        postId,
        userId,
      }).unwrap();

      dispatch(updateLikes({ postId, likes: res.data }));
      if (res.message && res.message === "liked") {
        handleSendNotification(
          socket,
          NOTIFICATION_TYPES.like,
          user.username,
          receiverName
        );
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleAddComment = async (
    { _id: postId, creator: { username: receiverName } },
    userId,
    comment,
    setComment
  ) => {
    if (comment.trim() === "") return;

    try {
      const res = await addComment({
        comment,
        postId,
        userId,
      }).unwrap();

      dispatch(updateComments({ postId, comments: res.data }));
      handleSendNotification(
        socket,
        NOTIFICATION_TYPES.comment,
        user.username,
        receiverName
      );
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

      dispatch(updateComments({ postId, comments: res.data }));
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

      dispatch(updateComments({ postId, comments: res.data }));
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

      dispatch(updateComments({ postId, comments: res.data }));
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleSavePost = async (postId, userId) => {
    const res = await savePost({ postId, userId }).unwrap();
    dispatch(updateSaves({ userId: userId, saves: res.data }));
  };

  return (
    <div className="w-full md:w-4/6 mx-auto md:ml-36 py-2 md:py-4">
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
