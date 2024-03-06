"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  useFollowUserMutation,
  useGetUsersMutation,
  useRemoveFollowerMutation,
  useSavePostMutation,
  useUnfollowUserMutation,
} from "../(redux)/slices/user/userApiSlice";

import {
  useAddCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
  useDeletePostMutation,
  useDeleteReplyMutation,
  useGetPostsMutation,
  useLikePostMutation,
} from "../(redux)/slices/post/postApiSlice";
import SavePost from "./SavePost";
import {
  removePost,
  setPosts,
  setUsers,
  updateComments,
  updateFollowers,
  updateFollowings,
  updateLikes,
  updateSaves,
} from "../(redux)/slices/data/dataSlice";
import { selectPosts, selectUser } from "../(redux)/selectors";

import moment from "moment";
import { IoSend } from "react-icons/io5";
import { FaComment, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdDelete, MdReport } from "react-icons/md";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import TurnedInIcon from "@mui/icons-material/TurnedIn";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo._id));
  const { posts } = useSelector(selectPosts(userInfo._id));

  const [getPosts] = useGetPostsMutation(); // get posts
  const [getUsers] = useGetUsersMutation(); // get users
  const [deletePost] = useDeletePostMutation(); // delete post
  const [savePost] = useSavePostMutation(); // save post
  const [followUser] = useFollowUserMutation(); // follow user
  const [removeFollower] = useRemoveFollowerMutation(); // remove follower
  const [UnfollowUser] = useUnfollowUserMutation(); // unfollow user
  const [likePost] = useLikePostMutation(); // like post
  const [addComment] = useAddCommentMutation(); // add comment
  const [addReply] = useAddReplyMutation(); // add reply
  const [deleteComment] = useDeleteCommentMutation(); // delete comment
  const [deleteReply] = useDeleteReplyMutation(); // delete reply

  const dispatch = useDispatch();

  const handleDeletePost = async (postId) => {
    try {
      const res = await deletePost(postId).unwrap();

      if (res.data) {
        dispatch(removePost(res.data._id || postId));
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  const handleRemoveFollower = async (userId, followerId) => {
    try {
      const res = await removeFollower({
        followerId,
        userId,
      }).unwrap();

      if (res.data) {
        dispatch(
          updateFollowings({
            userId: followerId,
            followings: res.data.followings,
          })
        );
        dispatch(updateFollowers({ userId, followers: res.data.followers }));
      }
    } catch (error) {
      console.error("Error removing follower", error);
    }
  };

  const handleFollow = async (userId, followingId) => {
    try {
      const res = await followUser({
        followingId,
        userId,
      }).unwrap();

      if (res.data) {
        dispatch(
          updateFollowings({
            userId,
            followings: res.data.followings,
          })
        );
        dispatch(
          updateFollowers({
            userId: followingId,
            followers: res.data.followers,
          })
        );
      }
    } catch (error) {
      console.error("Error following user", error);
    }
  };

  const handleUnfollow = async (userId, followingId) => {
    try {
      const res = await UnfollowUser({
        followingId,
        userId,
      }).unwrap();

      if (res.data) {
        userId;
        dispatch(
          updateFollowings({
            userId,
            followings: res.data.followings,
          })
        );
        dispatch(
          updateFollowers({
            userId: followingId,
            followers: res.data.followers,
          })
        );
      }
    } catch (error) {
      console.error("Error unfollowing user", error);
    }
  };

  const handleLike = async (postId, userId) => {
    try {
      const res = await likePost({
        postId,
        userId,
      }).unwrap();

      if (res.data) {
        dispatch(updateLikes({ postId, likes: res.data }));
      }
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

      if (res.data) {
        dispatch(updateComments({ postId, comments: res.data }));
      }
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

      if (res.data) {
        dispatch(updateComments({ postId, comments: res.data }));
      }
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

      if (res.data) {
        dispatch(updateComments({ postId, comments: res.data }));
      }
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

      if (res.data) {
        dispatch(updateComments({ postId, comments: res.data }));
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleSavePost = async (postId, userId) => {
    try {
      const res = await savePost({ postId, userId }).unwrap();

      if (res.data) {
        dispatch(updateSaves({ userId, saves: res.data }));
      }
    } catch (error) {
      console.error("Error saving post:", error);
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

    if (!posts || posts?.length <= 0) fetchPosts();
    if (!user) fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl ml-36 mt-4">
      <Header
        user={user}
        followers={user?.followers}
        followings={user?.followings}
        posts={posts}
      />
      <Navigation setActiveTab={setActiveTab} activeTab={activeTab} />
      {user && (
        <MainContent
          activeTab={activeTab}
          user={user}
          posts={posts}
          followers={user?.followers}
          followings={user?.followings}
          saves={user?.saves}
          handleDeletePost={handleDeletePost}
          handleRemoveFollower={handleRemoveFollower}
          handleFollow={handleFollow}
          handleUnfollow={handleUnfollow}
          handleLike={handleLike}
          handleAddComment={handleAddComment}
          handleAddReply={handleAddReply}
          handleDeleteComment={handleDeleteComment}
          handleDeleteReply={handleDeleteReply}
          handleSavePost={handleSavePost}
        />
      )}
    </div>
  );
};

const Header = ({ user, followers, followings, posts }) => {
  return (
    <div className="flex items-center justify-between p-4 ">
      <div className="flex items-center">
        <img
          src={user?.profileUrl}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full object-cover mr-4"
        />
        <div>
          <h1 className="text-2xl font-semibold">{user?.name}</h1>
          <h1 className="text-xl">@{user?.username}</h1>
          <div className="flex items-center space-x-4 mt-4">
            <p className="text-gray-600">
              {posts?.length} {posts?.length === 1 ? "post" : "posts"}
            </p>
            <p className="text-gray-600">
              {followers?.length}{" "}
              {followers?.length === 1 ? "follower" : "followers"}
            </p>
            <p className="text-gray-600">
              {followings?.length}{" "}
              {followings?.length === 1 ? "following" : "followings"}
            </p>
          </div>
        </div>
      </div>
      <div>
        <Link
          href="/profile/edit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

const Navigation = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex justify-center p-4 space-x-4 border-b border-gray-300">
      <button
        onClick={() => setActiveTab("posts")}
        className={`px-4 py-2  rounded-md  transition-colors ${
          activeTab == "posts"
            ? "bg-blue-400 hover:bg-blue-500"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => setActiveTab("followers")}
        className={`px-4 py-2  rounded-md  transition-colors ${
          activeTab == "followers"
            ? "bg-blue-400 hover:bg-blue-500"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        Followers
      </button>
      <button
        onClick={() => setActiveTab("followings")}
        className={`px-4 py-2  rounded-md  transition-colors ${
          activeTab == "followings"
            ? "bg-blue-400 hover:bg-blue-500"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        Followings
      </button>
      <button
        onClick={() => setActiveTab("saves")}
        className={`px-4 py-2  rounded-md  transition-colors ${
          activeTab == "saves"
            ? "bg-blue-400 hover:bg-blue-500"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        Saves
      </button>
    </div>
  );
};

const MainContent = ({
  activeTab,
  user,
  posts,
  followers,
  followings,
  saves,
  handleDeletePost,
  handleFollow,
  handleUnfollow,
  handleRemoveFollower,
  handleSavePost,
  handleLike,
  handleAddComment,
  handleAddReply,
  handleDeleteComment,
  handleDeleteReply,
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <PostsGrid
            user={user}
            posts={posts}
            handleDeletePost={handleDeletePost}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            handleAddReply={handleAddReply}
            handleDeleteComment={handleDeleteComment}
            handleDeleteReply={handleDeleteReply}
            handleSavePost={handleSavePost}
          />
        );
      case "followers":
        return (
          <FollowersList
            handleRemoveFollower={handleRemoveFollower}
            handleFollow={handleFollow}
            user={user}
            followers={followers}
            followings={followings}
          />
        );
      case "followings":
        return (
          <FollowingsList
            user={user}
            followings={followings}
            handleUnfollow={handleUnfollow}
          />
        );
      case "saves":
        return (
          <SavesList
            user={user}
            saves={saves}
            handleSavePost={handleSavePost}
          />
        );
      default:
        return (
          <PostsGrid
            user={user}
            posts={posts}
            handleDeletePost={handleDeletePost}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            handleAddReply={handleAddReply}
            handleDeleteComment={handleDeleteComment}
            handleDeleteReply={handleDeleteReply}
            handleSavePost={handleSavePost}
          />
        );
    }
  };

  return <div className="w-full p-4">{renderContent()}</div>;
};

const PostCard = ({
  post,
  user,
  handleLike,
  handleSavePost,
  handleAddReply,
  handleAddComment,
  handleDeleteComment,
  handleDeleteReply,
  handleDeletePost,
}) => {
  const [liked, setLiked] = useState();
  const [saved, setSaved] = useState();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");

  useEffect(() => {
    const saveIndex = user?.saves?.findIndex(
      (save) =>
        String(save?._id?._id) === post._id || String(save?._id) === post._id
    );
    setSaved(saveIndex != -1 ? true : false);
  }, [user]);

  useEffect(() => {
    setLiked(post.likes?.includes(user?._id));
  }, [post]);

  return (
    <div className=" bg-white dark:bg-gray-800 shadow-md rounded ">
      <div className="p-2 flex gap-2 items-center dark:text-white relative">
        <img
          className="w-14 h-14 rounded-full object-cover "
          src={post?.creator?.profileUrl}
        />
        <Link href={`/profile/${post?.creator?._id}`}>
          {post?.creator?.username}
        </Link>
        {post?.creator?._id !== user._id ? (
          <Link className="absolute right-2" href={`/report/${post._id}`}>
            <MdReport color="#f00" size={18} />
          </Link>
        ) : (
          ""
        )}
      </div>
      <img
        className="w-full h-64 object-cover"
        src={post.imageUrl}
        alt="Post"
      />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <button
                onClick={() => {
                  handleLike(post._id, user._id);
                  setLiked((prev) => !prev);
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
            onClick={() => {
              handleSavePost(post._id, user._id);
              setSaved((prev) => !prev);
            }}
          >
            {saved ? <TurnedInIcon /> : <TurnedInNotIcon />}
          </div>
        </div>
        <p className=" text-gray-800 dark:text-gray-400 mt-4">{post.caption}</p>
        <p className=" text-gray-800 dark:text-gray-400 mb-1">
          {post.location}
        </p>
        <p className=" text-gray-400 dark:text-gray-400 mb-4">
          {moment(post.createdAt).startOf("minute").fromNow()}
        </p>
        {showComments ? (
          <>
            <div className="mt-2">
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
                          @{comment.userId?.username}
                        </Link>
                        <p className="text-gray-700 dark:text-gray-200">
                          {comment.comment}
                        </p>
                        <p className="text-gray-300 dark:text-gray-200">
                          {moment(comment.createdAt)
                            .startOf("minute")
                            .fromNow()}
                        </p>
                        {comment.userId?._id !== user._id ? (
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
                                            @{reply.userId?.username}
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
                                        {reply.userId?._id === user._id ? (
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
                                        post._id,
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
                              ""
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      {comment.userId?._id === user._id ? (
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
                    handleAddComment(post._id, user._id, comment, setComment)
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
      <div className="flex justify-between items-center mb-2 px-4">
        <Link
          href={`/post/edit/${post._id}`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Edit Post
        </Link>
        <button
          onClick={() => handleDeletePost(post._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Post
        </button>
      </div>
    </div>
  );
};

const PostsGrid = ({
  posts,
  handleDeletePost,
  user,
  handleDeleteComment,
  handleDeleteReply,
  handleAddReply,
  handleAddComment,
  handleLike,
  handleSavePost,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {posts && posts?.length > 0 ? (
        posts.map((post, index) => (
          <PostCard
            key={index}
            user={user}
            post={post}
            handleDeletePost={handleDeletePost}
            handleLike={handleLike}
            handleAddComment={handleAddComment}
            handleAddReply={handleAddReply}
            handleDeleteComment={handleDeleteComment}
            handleDeleteReply={handleDeleteReply}
            handleSavePost={handleSavePost}
          />
        ))
      ) : (
        <p>No posts</p>
      )}
    </div>
  );
};

const FollowersList = ({ user, followers, handleRemoveFollower }) => {
  return (
    <div className="w-1/2">
      <h3 className="text-xl font-semibold mb-4">Followers</h3>

      {followers && followers.length > 0 ? (
        <ul>
          {followers.map((follower) => (
            <li
              key={follower._id._id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={follower._id.profileUrl}
                  alt={follower._id.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link href={`/profile/${follower._id._id}`}>
                  {follower._id.username}
                </Link>
              </div>
              <button
                className="text-red-500 hover:text-red-400 transition-colors"
                onClick={() =>
                  handleRemoveFollower(user?._id, follower._id._id)
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No followers</p>
      )}
    </div>
  );
};

const FollowingsList = ({ user, followings, handleUnfollow }) => {
  return (
    <div className="w-1/2">
      <h2 className="text-xl font-semibold mb-4">Followings</h2>

      {followings ? (
        <ul>
          {followings.map((following) => (
            <li
              key={following._id._id}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-2">
                <img
                  src={following._id.profileUrl}
                  alt={following._id.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link href={`/profile/${following._id._id}`}>
                  {following._id.username}
                </Link>
              </div>
              <button
                className="text-blue-500 hover:text-blue-400 transition-colors"
                onClick={() => handleUnfollow(user?._id, following._id._id)}
              >
                Unfollow
              </button>
            </li>
          ))}
        </ul>
      ) : (
        "Loading..."
      )}
    </div>
  );
};

const SavesList = ({ user, saves, handleSavePost }) => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-4">
        {saves
          ? saves.map((post) => (
              <SavePost
                key={post?._id?._id}
                post={post}
                user={user}
                handleSavePost={handleSavePost}
              />
            ))
          : "No saved posts"}
      </div>
    </div>
  );
};

export default UserProfile;
