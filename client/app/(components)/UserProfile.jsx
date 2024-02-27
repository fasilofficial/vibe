"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useGetUserPostsMutation } from "../(redux)/slices/user/userApiSlice";
import { setUserPosts } from "../(redux)/slices/user/userSlice";
import { StyledListItem } from "@mui/joy/ListItem/ListItem";

const fakeFollowers = [
  { id: 1, name: "Follower 1", isFollowing: true },
  { id: 2, name: "Follower 2", isFollowing: false },
  { id: 3, name: "Follower 3", isFollowing: true },
  { id: 4, name: "Follower 4", isFollowing: false },
];

const fakeFollowing = [
  { id: 1, name: "Following 1" },
  { id: 2, name: "Following 2" },
  { id: 3, name: "Following 3" },
  { id: 4, name: "Following 4" },
];

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");

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
        onClick={() => setActiveTab("following")}
        className="px-4 py-2 bg-transparent border border-gray-500 rounded-md"
      >
        Following
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
        return <FollowersList />;
      case "following":
        return <FollowingList />;
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

const FollowersList = () => {
  return (
    <div className="w-1/2">
      <h2 className="text-xl font-semibold mb-4">Followers</h2>
      <ul>
        {fakeFollowers.map((follower) => (
          <li
            key={follower.id}
            className="flex items-center justify-between space-x-4 py-2"
          >
            <div className="flex items-center space-x-4">
              <img
                src={`https://source.unsplash.com/100x100/?portrait,${follower.id}`}
                alt={follower.name}
                className="w-10 h-10 rounded-full"
              />
              <span>{follower.name}</span>
            </div>
            {follower.isFollowing ? (
              <button
                onClick={() => handleFollowBack(follower.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                Follow Back
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Avatar from "@mui/joy/Avatar";
import { useDeletePostMutation } from "../(redux)/slices/post/postApiSlice";

const FollowingList = () => {
  return (
    <div className="w-1/2">
      <h2 className="text-xl font-semibold mb-4">Following</h2>
      <List variant="outlined">
        {fakeFollowing.map((following) => (
          <>
            <ListItem>
              <ListItemDecorator>
                <Avatar size="sm" src="/static/images/avatar/1.jpg" />
              </ListItemDecorator>
              {following.name}
            </ListItem>
            <ListDivider />
          </>
        ))}
      </List>
    </div>
  );
};

export default UserProfile;