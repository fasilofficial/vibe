"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import {
  useGetFollowersMutation,
  useGetFollowingsMutation,
  useGetUserPostsMutation,
} from "../(redux)/slices/user/userApiSlice";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("followings");

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className=" max-w-5xl mx-auto mt-4">
      <Header userInfo={userInfo} />
      <Navigation setActiveTab={setActiveTab} />
      <MainContent activeTab={activeTab} userInfo={userInfo} />
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

const MainContent = ({ activeTab, userInfo }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "posts":
        return <PostsGrid userInfo={userInfo} />;
      case "followers":
        return <FollowersList userInfo={userInfo} />;
      case "followings":
        return <FollowingsList userInfo={userInfo} />;
      case "saves":
        return <SavesList userInfo={userInfo} />;
      default:
        return <PostsGrid userInfo={userInfo} />;
    }
  };

  return <div className="w-full p-4">{renderContent()}</div>;
};

const PostCard = ({ post, onEdit, onDelete }) => {
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
            onClick={() => onDelete(post._id)}
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

const PostsGrid = ({ userInfo }) => {
  const [getPosts, { isLoading, error }] = useGetUserPostsMutation();
  const [deletePost] = useDeletePostMutation();

  const [posts, setPosts] = useState();

  const handleDeletePost = async (postId) => {
    const res = await deletePost(postId).unwrap();
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await getPosts(userInfo._id).unwrap();
      console.log("res:", res);
      setPosts(res);
    };
    fetchPosts();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts
        ? posts.map((post, index) => (
            <PostCard key={index} post={post} onDelete={handleDeletePost} />
          ))
        : "No posts"}
    </div>
  );
};

const FollowersList = ({ userInfo }) => {
  const [followers, setFollowers] = useState();
  const [getfollowers] = useGetFollowersMutation();

  const [followings, setFollowings] = useState();
  const [getFollowings] = useGetFollowingsMutation();

  const handleFollow = async (followingId) => {
    console.log("Follow:", followingId);
    console.log(userInfo._id);

    // const res = await followUser({ followingId, userId: userInfo._id }).unwrap()

    const res = await fetch(
      `http://localhost:3300/api/v1/users/${userInfo._id}/followings`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId }),
      }
    );

    const data = await res.json();
    console.log(data);
  };

  const handleRemove = async (followingId) => {
    console.log("Remove:", followingId);
    console.log(userInfo._id);

    // const res = await followUser({ followingId, userId: userInfo._id }).unwrap()

    const res = await fetch(
      `http://localhost:3300/api/v1/users/${followingId}/followings`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId: userInfo._id }),
      }
    );

    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    setFollowings(userInfo.followings);
    setFollowers(userInfo.followers);
  }, [userInfo]);

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
                  onClick={() => handleRemove(follower._id._id)}
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
        "Loading..."
      )}
    </div>
  );
};

import { useDeletePostMutation } from "../(redux)/slices/post/postApiSlice";

const FollowingsList = ({ userInfo }) => {
  const [followings, setFollowings] = useState();
  const [getFollowings] = useGetFollowingsMutation();

  const handleUnfollow = async (followingId) => {
    console.log("Unfollow:", followingId);
    console.log(userInfo._id);

    // const res = await followUser({ followingId, userId: userInfo._id }).unwrap()

    const res = await fetch(
      `http://localhost:3300/api/v1/users/${userInfo._id}/followings`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ followingId }),
      }
    );

    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    setFollowings(userInfo.followings);
  }, [userInfo]);

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
                  {following._id.name}
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

const SavesList = ({ userInfo }) => {
  const [saves, setSaves] = useState();

  useEffect(() => {
    setSaves(userInfo.saves);
  }, [userInfo]);

  return (
    <div>
      {saves
        ? saves.map((save) => {
            return <p>{save._id._id}</p>;
          })
        : ""}
    </div>
  );
};

export default UserProfile;
