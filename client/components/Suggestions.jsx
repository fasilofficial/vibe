"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  useFollowUserMutation,
  useGetUsersMutation,
} from "../redux/slices/user/userApiSlice";
import {
  setUsers,
  updateFollowers,
  updateFollowings,
} from "../redux/slices/data/dataSlice";
import { selectSuggestions, selectUser } from "../redux/selectors";
import { NOTIFICATION_TYPES } from "@/constants";
import { useSocket } from "@/providers/SocketProvider";
import { handleSendNotification } from "./UserLayout";

const Suggestions = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo?._id));
  const { suggestions } = useSelector(selectSuggestions(user));

  const dispatch = useDispatch();

  const socket = useSocket();

  const [getUsers] = useGetUsersMutation();
  const [followUser] = useFollowUserMutation();

  // const handleSendNotification = (socket, type, senderName, receiverName) => {
  //   socket.emit("sendNotification", { type, senderName, receiverName });
  // };

  const handleFollow = async (
    userId,
    { _id: followingId, username: receiverName }
  ) => {
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
        handleSendNotification(
          socket,
          NOTIFICATION_TYPES.follow,
          user.username,
          receiverName
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
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

    if (!user) fetchUsers();
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
                      <Link href={`/profile/${user?._id}`}>
                        {user.username}
                      </Link>
                      <h3
                        onClick={() => handleFollow(userInfo._id, user)}
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
