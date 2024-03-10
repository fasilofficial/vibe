"use client";

import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

import Link from "next/link";

import moment from "moment";
import { IoSend } from "react-icons/io5";
import { FaComment, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdDelete, MdReport } from "react-icons/md";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";

const Post = ({
  post,
  user,
  handleLike,
  handleAddComment,
  handleDeleteComment,
  handleAddReply,
  handleDeleteReply,
  handleSavePost,
}) => {
  const [liked, setLiked] = useState();
  const [saved, setSaved] = useState();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const saveIndex = user?.saves?.findIndex(
      (save) => String(save?._id?._id) === post._id
    );
    setSaved(saveIndex != -1 ? true : false);
  }, [user]);

  useEffect(() => {
    setLiked(post.likes?.includes(user?._id));
  }, [post]);

  return (
    <div className="mx-auto w-4/6 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-8">
      <div className="p-2 flex gap-2 items-center dark:text-white relative">
        <img
          className="w-14 h-14 rounded-full object-cover "
          src={post?.creator?.profileUrl}
        />
        <Link href={`/profile/${post?.creator?._id}`}>
          {post?.creator?.username}
        </Link>
        {post?.creator?._id !== user?._id ? (
          <Link className="absolute right-2" href={`/report/${post._id}`}>
            <MdReport color="#f00" size={18} />
          </Link>
        ) : (
          ""
        )}
      </div>
      <img
        className="w-full h-96 object-cover"
        src={post.imageUrl}
        alt="Post"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button
                onClick={() => {
                  handleLike(post, user?._id);
                }}
                data-postid={post._id}
                className="text-gray-800 focus:outline-none"
                type="button"
              >
                {liked ? <FaHeart color="#F00" /> : <FaRegHeart />}
              </button>
              <span className="ml-2 text-gray-600 dark:text-gray-200">
                {post?.likes?.length} likes
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
                {post?.comments?.length} comments
              </span>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={() => handleSavePost(post._id, user._id)}
          >
            {saved ? <TurnedInIcon /> : <TurnedInNotIcon />}
          </div>
        </div>
        <p className=" text-gray-800 dark:text-gray-400 mt-4 mb-1">
          {post.caption}
        </p>
        <p className=" text-gray-400 dark:text-gray-400 mb-4">
          {moment(post.createdAt).startOf("minute").fromNow()}
        </p>
        {showComments ? (
          <>
            <div className="mt-2">
              {/* Comments */}
              <div className="mt-1 max-h-44 overflow-y-scroll ">
                {post.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex justify-between p-1 border rounded mb-2"
                  >
                    <div className="flex gap-2 ">
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
                          {moment(comment.createdAt)
                            .startOf("minute")
                            .fromNow()}
                        </p>
                        {comment.userId._id !== user._id ? (
                          <>
                            <p
                              type="button"
                              className="text-gray-400 hover:text-gray-500 cursor-pointer"
                              onClick={() => setShowReplyInput((prev) => !prev)}
                            >
                              replay
                            </p>
                            {comment.replies
                              ? comment.replies.map((reply) => {
                                  return (
                                    <div className="flex justify-between  p-1 border rounded mb-2 min-w-64 ">
                                      <div className="flex gap-2 ">
                                        <img
                                          src={reply?.userId?.profileUrl}
                                          className="w-8 h-8 rounded-full object-cover "
                                        />
                                        <div className="flex flex-col">
                                          <Link
                                            href={`/profile/${reply?.userId?._id}`}
                                            className="text-gray-500 dark:text-gray-200 text-sm"
                                          >
                                            @{reply.userId.username}
                                          </Link>
                                          <p className="text-gray-700 dark:text-gray-200">
                                            {reply.comment}
                                          </p>
                                          <p className="text-gray-300 dark:text-gray-200">
                                            {moment(reply.createdAt)
                                              .startOf("minute")
                                              .fromNow()}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        {reply.userId._id === user._id ? (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteReply(
                                                post._id,
                                                comment._id,
                                                reply._id
                                              )
                                            }
                                          >
                                            <MdDelete />
                                          </button>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    </div>
                                  );
                                })
                              : ""}

                            {showReplyInput ? (
                              <form className="mt-2">
                                <div className="flex justify-between items-center w-full border rounded-md p-2 dark:text-gray-200 dark:bg-gray-700 ">
                                  <input
                                    type="text"
                                    placeholder="Reply for comment..."
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    className="focus:outline-none"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddReply(
                                        post,
                                        comment._id,
                                        user._id,
                                        reply,
                                        setReply,
                                        setShowReplyInput
                                      )
                                    }
                                  >
                                    <IoSend />
                                  </button>
                                </div>
                              </form>
                            ) : (
                              // <form
                              //   onSubmit={(e) =>
                              //     handleAddReply(e, post._id, comment._id, reply)
                              //   }
                              //   data-postid={post._id}
                              //   className="mt-2"
                              // >
                              //   <input
                              //     type="text"
                              //     placeholder="Add a comment..."
                              //     value={reply}
                              //     onChange={(e) => setReply(e.target.value)}
                              //     className="w-full border rounded-md p-2 dark:text-gray-200 dark:bg-gray-700 focus:outline-none focus:border-blue-500"
                              //   />
                              // </form>
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      {comment.userId._id === user._id ? (
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
            <form className="mt-2">
              <div className="flex justify-between gap-1 items-center w-full border rounded-md p-2 dark:text-gray-200 dark:bg-gray-700 ">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleAddComment(post, user._id, comment, setComment)
                  }
                >
                  <IoSend />
                </button>
              </div>
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
