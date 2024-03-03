"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  useFollowUserMutation,
  useGetUsersMutation,
} from "../(redux)/slices/user/userApiSlice";
import {
  updateFollowers,
  updateFollowings,
} from "../(redux)/slices/data/dataSlice";

const Suggestions = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [suggestions, setSuggestions] = useState();

  const [getUsers] = useGetUsersMutation();

  const [followUser] = useFollowUserMutation();

  const dispatch = useDispatch();

  const handleFollow = async (followingId) => {
    try {
      const res = await followUser({
        followingId,
        userId: userInfo._id,
      }).unwrap();

      if (res.data) {
        dispatch(
          updateFollowings({
            userId: userInfo._id,
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
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await getUsers().unwrap();

      setSuggestions(res.filter((user) => user._id !== userInfo._id));
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="p-4 w-80 fixed right-0 ">
      <div className="bg-white dark:bg-gray-800 p-4">
        {userInfo?.profileUrl && (
          <div className="flex flex-col gap-4">
            <img
              src={userInfo?.profileUrl}
              className="w-48 h-48 mx-auto rounded-full object-cover"
            />
            <p className="text-center">@{userInfo?.username}</p>
            <Link
              href="/profile"
              className="p-2 mb-4 rounded bg-blue-500 text-white text-center"
            >
              View Profile
            </Link>
          </div>
        )}

        <div className="p-4 pr-8 dark:bg-gray-800 shadow-md rounded flex flex-col gap-4">
          <h1>People you may know</h1>
          <div>
            {suggestions ? (
              suggestions.map((user, index) => {
                return (
                  <div key={index} className="mb-2 flex gap-2 items-center">
                    <img
                      src={user.profileUrl}
                      className="w-12 h-12 rounded-full object-cover border-gray-400 border flex justify-center items-center"
                    />

                    <div className="flex flex-col">
                      <h1>{user.username}</h1>
                      <h3
                        onClick={() => handleFollow(user._id)}
                        className="text-blue-700 cursor-pointer hover:text-blue-600 "
                      >
                        Follow
                      </h3>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
