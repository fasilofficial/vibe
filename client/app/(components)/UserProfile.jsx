"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  useFollowUserMutation,
  useGetUserPostsMutation,
  useRemoveFollowerMutation,
  useSavePostMutation,
  useUnfollowUserMutation,
} from "../(redux)/slices/user/userApiSlice";

import { useDeletePostMutation } from "../(redux)/slices/post/postApiSlice";
import { setUserPosts } from "../(redux)/slices/user/userSlice";
import SavePost from "./SavePost";
import {
  setCredentials,
  updateFollowers,
  updateFollowings,
} from "../(redux)/slices/auth/authSlice";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const { userInfo } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.user);

  const [getPosts] = useGetUserPostsMutation(); // get user posts
  const [deletePost] = useDeletePostMutation(); // delete post
  const [unsavePost] = useSavePostMutation(); // Unsave post
  const [followUser] = useFollowUserMutation(); // follow user
  const [removeFollower] = useRemoveFollowerMutation(); // remove follower
  const [UnfollowUser] = useUnfollowUserMutation(); // unfollow user

  const dispatch = useDispatch();

  const handleDeletePost = async (postId) => {
    const res = await deletePost(postId).unwrap();
  };

  const handleFollow = async (followingId) => {
    try {
      const res = await followUser({
        followingId,
        userId: userInfo._id,
      }).unwrap();

      dispatch(updateFollowings(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      const res = await removeFollower({
        followerId,
        userId: userInfo._id,
      }).unwrap();

      dispatch(updateFollowers(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfollow = async (followingId) => {
    try {
      const res = await UnfollowUser({
        followingId,
        userId: userInfo._id,
      }).unwrap();

      dispatch(updateFollowings(res.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnsavePost = async (postId, userId) => {
    try {
      const res = await unsavePost({ postId, userId }).unwrap();
      dispatch(setCredentials(res.user));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts(userInfo._id).unwrap();
      dispatch(setUserPosts(res));
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-6xl ml-36 mt-4">
      <Header userInfo={userInfo} />
      <Navigation setActiveTab={setActiveTab} />
      <MainContent
        activeTab={activeTab}
        userInfo={userInfo}
        posts={posts}
        followers={userInfo.followers}
        followings={userInfo.followings}
        saves={userInfo.saves}
        handleDeletePost={handleDeletePost}
        handleRemoveFollower={handleRemoveFollower}
        handleFollow={handleFollow}
        handleUnfollow={handleUnfollow}
        handleUnsavePost={handleUnsavePost}
      />
    </div>
  );
};

const Header = ({ userInfo }) => {
  return (
    <div className="flex items-center justify-between p-4 ">
      <div>
        <img
          src={userInfo?.profileUrl}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">{userInfo?.name}</span>
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

const Navigation = ({ setActiveTab }) => {
  return (
    <div className="flex justify-center p-4 space-x-4 border-b border-gray-300">
      <button
        onClick={() => setActiveTab("posts")}
        className="px-4 py-2 bg-transparent border border-gray-500 rounded-md"
      >
        Posts
      </button>
      <button
        onClick={() => setActiveTab("followers")}
        className="px-4 py-2 bg-transparent border border-gray-500 rounded-md"
      >
        Followers
      </button>
      <button
        onClick={() => setActiveTab("followings")}
        className="px-4 py-2 bg-transparent border border-gray-500 rounded-md"
      >
        Followings
      </button>
      <button
        onClick={() => setActiveTab("saves")}
        className="px-4 py-2 bg-transparent border border-gray-500 rounded-md"
      >
        Saves
      </button>
    </div>
  );
};

const MainContent = ({
  activeTab,
  userInfo,
  posts,
  followers,
  followings,
  saves,
  handleDeletePost,
  handleFollow,
  handleUnfollow,
  handleRemoveFollower,
  handleUnsavePost,
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return (
          <PostsGrid
            userInfo={userInfo}
            posts={posts}
            handleDeletePost={handleDeletePost}
          />
        );
      case "followers":
        return (
          <FollowersList
            handleRemoveFollower={handleRemoveFollower}
            handleFollow={handleFollow}
            userInfo={userInfo}
            followers={followers}
            followings={followings}
          />
        );
      case "followings":
        return (
          <FollowingsList
            userInfo={userInfo}
            followings={followings}
            handleUnfollow={handleUnfollow}
          />
        );
      case "saves":
        return (
          <SavesList
            userInfo={userInfo}
            saves={saves}
            handleUnsavePost={handleUnsavePost}
          />
        );
      default:
        return (
          <PostsGrid
            userInfo={userInfo}
            posts={posts}
            handleDeletePost={handleDeletePost}
          />
        );
    }
  };

  return <div className="w-full p-4">{renderContent()}</div>;
};

const PostCard = ({ post, handleDeletePost }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 dark:text-white">
      <img src={post.imageUrl} alt="Post" className="w-full" />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{post.caption}</div>
        <p className="text-gray-700 dark:text-gray-200 text-base mb-2">
          Location: {post.location}
        </p>
        <div className="flex justify-between items-center mb-2">
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
        <div className="flex items-center mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          <span className="text-gray-700 dark:text-gray-200">
            {post.likes.length}
          </span>
        </div>
        <p className="text-gray-700 dark:text-gray-200 text-base mb-2">
          Created At: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <div className="text-gray-700 dark:text-gray-200 text-base mb-2">
          Comments:
        </div>
        <div>
          {post.comments.map((comment, index) => (
            <p key={index}>{comment.comment}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

const PostsGrid = ({ posts, handleDeletePost }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {posts
        ? posts.map((post, index) => (
            <PostCard
              key={index}
              post={post}
              handleDeletePost={handleDeletePost}
            />
          ))
        : "No posts"}
    </div>
  );
};

const FollowersList = ({
  userInfo,
  followers,
  followings,
  handleFollow,
  handleRemoveFollower,
}) => {
  return (
    <div className="w-1/2">
      <h2 className="text-xl font-semibold mb-4">Followers</h2>

      {followers && followings ? (
        <ul>
          {followers.map((follower) => (
            <li
              key={follower._id._id}
              className="flex items-center justify-between space-x-4 py-2"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={follower._id.profileUrl}
                  alt={follower._id.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <Link href={`/profile/${follower._id._id}`}>
                  {follower._id.name}
                </Link>
                <button
                  className="text-red-500 hover:text-red-400 transition-colors"
                  onClick={() => handleRemoveFollower(follower._id._id)}
                >
                  Remove
                </button>

                {/* {!followings.includes(follower._id._id) ? (
                  <button
                    className="text-blue-500 hover:text-blue-400 transition-colors"
                    onClick={() => handleFollow(follower._id._id)}
                  >
                    Follow Back
                  </button>
                ) : (
                  ""
                )} */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        "No followers"
      )}
    </div>
  );
};

const FollowingsList = ({ followings, handleUnfollow }) => {
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
                onClick={() => handleUnfollow(following._id._id)}
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

const SavesList = ({ userInfo, saves, handleUnsavePost }) => {
  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-3 gap-4">
        {saves
          ? saves.map((post) => (
              <SavePost
                key={post._id._id}
                post={post}
                user={userInfo}
                handleUnsavePost={handleUnsavePost}
              />
            ))
          : "No saved posts"}
      </div>
    </div>
  );
};

export default UserProfile;
