"use client";

import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  FaComment,
  FaHeart,
  FaRegComment,
  FaRegHeart,
  FaSave,
} from "react-icons/fa";
import { MdDelete, MdReport } from "react-icons/md";
import Link from "next/link";

import { useSelector } from "react-redux";
import {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useLikePostMutation,
} from "../(redux)/slices/post/postApiSlice";

import moment from "moment";

const Post = ({ post }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [liked, setLiked] = useState(post.likes.includes(userInfo._id));
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([]);

  const [showComments, setShowComments] = useState(false);

  const [showReplyInput, setShowReplyInput] = useState(false);

  const [reply, setReply] = useState("");

  const [likePost] = useLikePostMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [addComment] = useAddCommentMutation();

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleLike = async (postId) => {
    setLiked(!liked);

    const res = await likePost({
      postId,
      userId: userInfo._id,
    });
  };

  const handleDeleteComment = async (postId, commentId) => {
    const res = await deleteComment({
      postId,
      commentId,
    }).unwrap();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (comment.trim() === "") return;

    setComment("");

    const postId = e.target.dataset.postid;

    const res = await addComment({
      comment,
      postId,
      userId: userInfo._id,
    }).unwrap();

    setPostComments((prevComments) => [...prevComments, { comment }]);
  };

  const handleSavePost = async (postId) => {
    console.log("Save:", postId);
  };

  const handleReply = async (e, postId, commentId) => {
    e.preventDefault()
    console.log(postId, commentId, reply);
  };

  useEffect(() => {
    setPostComments(post.comments);
  }, [postComments]);

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
      <div className=" p-2 flex gap-2 items-center dark:text-white relative">
        <img
          className="w-14 h-14 rounded-full object-cover "
          src={post?.creator?.profileUrl}
        />
        <Link href={`/profile/${post?.creator?._id}`}>
          {post?.creator?.username}
        </Link>
        {post?.creator?._id !== userInfo._id ? (
          <Link className="absolute right-2" href={`/report/${post._id}`}>
            <MdReport color="#f00" size={18} />
          </Link>
        ) : (
          ""
        )}
      </div>
      <img className="w-full" src={post.imageUrl} alt="Post" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button
                onClick={() => {
                  handleLike(post._id);
                }}
                data-postid={post._id}
                className="text-gray-800 focus:outline-none"
                type="button"
              >
                {liked ? <FaHeart color="#F00" /> : <FaRegHeart />}
              </button>
              <span className="ml-2 text-gray-600 dark:text-gray-200">
                {post.likes.length} likes
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  setShowComments((prev) => !prev);
                }}
                data-postid={post._id}
                className="text-gray-800 focus:outline-none ml-2"
                type="button"
              >
                {showComments ? <FaComment /> : <FaRegComment />}
              </button>
              <span className="ml-2 text-gray-600 dark:text-gray-200">
                {post.comments.length} comments
              </span>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleSavePost(post._id)}
          >
            <FaSave />
          </div>
        </div>
        <p className=" text-gray-800 dark:text-gray-400 mt-4 mb-1">{post.caption}</p>
        <p className=" text-gray-400 dark:text-gray-400 mb-4">
          {moment(post.createdAt).startOf("minute").fromNow()}
        </p>
        {showComments ? (
          <>
            <div className="mt-2">
              {/* Comments */}
              <div className="mt-1 max-h-44 overflow-y-scroll ">
                {postComments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-1 border rounded mb-2"
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={comment?.userId?.profileUrl}
                        className="w-8 h-8 rounded-full object-cover "
                      />
                      <div className="flex flex-col">
                        <Link
                          href={`/profile/${comment?.userId?._id}`}
                          className="text-gray-500 dark:text-gray-200 text-sm"
                        >
                          @{comment.userId.username}
                        </Link>
                        <p className="text-gray-700 dark:text-gray-200">
                          {comment.comment}
                        </p>
                        <p className="text-gray-300 dark:text-gray-200">
                        {moment(comment.createdAt).startOf("minute").fromNow()}
                        </p>
                        {comment.userId._id !== userInfo._id ? (
                          <>
                            <p
                              type="button"
                              className="text-gray-400 hover:text-gray-500 cursor-pointer"
                              onClick={() => setShowReplyInput((prev) => !prev)}
                            >
                              Replay
                            </p>
                            {showReplyInput ? (
                              <form
                                onSubmit={(e) => handleReply(e, post._id, comment._id)}
                                data-postid={post._id}
                                className="mt-2"
                              >
                                <input
                                  type="text"
                                  placeholder="Add a comment..."
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                  className="w-full border rounded-md p-2 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                                />
                              </form>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      {comment.userId._id === userInfo._id ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteComment(post._id, comment._id)
                          }
                        >
                          <MdDelete />
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <form
              onSubmit={handleAddComment}
              data-postid={post._id}
              className="mt-2"
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
                className="w-full border rounded-md p-2 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
              />
            </form>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Post;
