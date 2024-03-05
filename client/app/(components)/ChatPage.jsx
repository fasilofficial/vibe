"use client";

import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { selectChats, selectUser } from "../(redux)/selectors";
import { useSelector, useDispatch } from "react-redux";
import generateRoomName from "../(utils)/generateRoomName";
import {
  useAddChatMutation,
  useGetChatsMutation,
} from "../(redux)/slices/chat/chatApiSlice";
import { setChats } from "../(redux)/slices/data/dataSlice";
import { IoSend } from "react-icons/io5";
import moment from "moment";
import Link from "next/link";

const ChatPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo._id));
  const [receiver, setReceiver] = useState();
  const [sender, setSender] = useState(user);
  const { chats } = useSelector(selectChats(userInfo?._id, receiver?._id));

  const [inbox, setInbox] = useState([]);
  const [socket, setSocket] = useState();
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const [addChat] = useAddChatMutation();
  const [getChats] = useGetChatsMutation();

  const handleSelectReceiver = (receiver) => {
    setReceiver(receiver);
    setRoomName(generateRoomName(user?.email, receiver?.email));
    socket.emit("joinRoom", roomName);
  };

  const dispatch = useDispatch();

  const handleJoinRoom = () => {
    socket.emit("joinRoom", roomName);
  };

  const handleSendMessage = async () => {
    if (!message || !roomName || !sender || !receiver) return;

    if (message.trim() === "") return;

    const data = {
      message,
      roomName,
      sender: sender?._id,
      receiver: receiver?._id,
    };

    try {
      socket.emit("message", data);

      const res = await addChat(data).unwrap();
      console.log(res);
      if (res.data) {
        dispatch(setChats([...chats, res.data]));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setMessage("");
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3300");

    socket.on("message", ({ message, roomName, sender, receiver }) => {
      console.log({ message, roomName, sender, receiver });
      console.log("receive");
      dispatch(setChats([...chats, { message, roomName, sender, receiver }]));

      // setInbox((prevState) => {
      //   if (!prevState.includes(message)) {
      //     return [...prevState, message];
      //   } else {
      //     return prevState;
      //   }2
      // });
    });

    setSocket(socket);
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChats().unwrap();
        console.log(res);
        if (res.data) {
          dispatch(setChats(res.data));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchChats();
  }, []);

  // useEffect(() => {
  //   console.log(chats);
  //   chats.map((chat) => setInbox((prev) => [...prev, chat?.message]));
  // }, [receiver]);

  return (
    <div className="w-4/6 ml-36 mt-4 h-screen">
      <div className="flex gap-4 h-[96%]">
        <div className="flex flex-col gap-2 min-w-64 p-2 dark:bg-gray-800 shadow-md rounded-sm">
          <div className="flex justify-between items-center w-full border-b py-2">
            {/* <button
              onClick={() => setActiveTab("all")}
              className={`${activeTab === "all" ? "font-bold" : ""}`}
            >
              All
            </button> */}
            <button
              onClick={() => setActiveTab("followers")}
              className={`${activeTab === "followers" ? "font-bold" : ""}`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab("followings")}
              className={`${activeTab === "followings" ? "font-bold" : ""}`}
            >
              Followings
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <ChatList
              activeTab={activeTab}
              all={[...user?.followers, ...user?.followings]}
              followers={user?.followers}
              followings={user?.followings}
              receiver={receiver}
              handleSelectReceiver={handleSelectReceiver}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 w-full p-2 border ">
          {receiver ? (
            <>
              <div className="flex-none flex gap-2 border rounded p-2 items-center w-full cursor-pointer">
                <img
                  className="w-14 h-14 rounded-full object-cover"
                  src={receiver?.profileUrl}
                  alt={receiver?.username}
                />
                <div>
                  <Link
                    href={`/profile/${receiver?._id}`}
                    className="font-bold"
                  >
                    {receiver?.username}
                  </Link>
                  <p className="text-gray-400 text-sm ">
                    {moment(chats[chats?.length - 1]?.createdAt)
                      .startOf("second")
                      .fromNow()}
                  </p>
                </div>
              </div>

              <div className="flex flex-grow flex-col gap-4 bg-white dark:bg-gray-800 min-h-96 overflow-y-scroll p-2">
                {chats.map((chat, index) => (
                  <div
                    className={`w-full flex ${
                      chat?.sender?._id === user?._id
                        ? "justify-end"
                        : "justify-start"
                    } `}
                  >
                    <div
                      className={` min-w-80  max-w-fit flex gap-2`}
                      key={chat._id || index}
                    >
                      {chat?.sender?._id === user?._id ? (
                        <>
                          <div className="w-full p-2 border border-b rounded shadow">
                            <p className="font-semibold">
                              {chat?.sender?._id === user?._id
                                ? "Me"
                                : chat?.sender?.username}
                            </p>
                            <p>{chat?.message}</p>
                            <p className="text-right text-xs text-gray-500">
                              {moment(chat?.createdAt)
                                .startOf("second")
                                .fromNow()}
                            </p>
                          </div>
                          <img
                            src={chat?.sender?.profileUrl}
                            className={`w-8 h-8 rounded-full object-cover`}
                            alt={chat?.sender?.username}
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={chat?.sender?.profileUrl}
                            className={`w-8 h-8 rounded-full object-cover`}
                            alt={chat?.sender?.username}
                          />
                          <div className="w-full p-2 border border-b rounded shadow">
                            <p className="font-semibold">
                              {chat?.sender?._id === user?._id
                                ? "Me"
                                : chat?.sender?.username}
                            </p>
                            <p>{chat?.message}</p>
                            <p className="text-right text-xs text-gray-500">
                              {moment(chat?.createdAt)
                                .startOf("second")
                                .fromNow()}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex gap-4 ">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    name="message"
                    placeholder="Enter message"
                    className="dark:bg-gray-700 p-2 text-gray-800 rounded-sm w-full outline-none border border-gray-300 focus:border-gray-400 "
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-full h-12 w-12 flex justify-center items-center cursor-pointer border-black bg-blue-800 text-white"
                    type="button"
                  >
                    <IoSend />
                  </button>
                </div>
                {/* <div className="flex gap-4">
                  <input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    type="text"
                    name="room"
                    className="dark:bg-gray-700 p-2 rounded-sm w-full"
                  />
                  <button
                    onClick={handleJoinRoom}
                    className="p-2 rounded-md cursor-pointer border-black bg-blue-500"
                    type="button"
                  >
                    Join room
                  </button>
                </div> */}
              </div>
            </>
          ) : (
            <div className="w-full">No chat selected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

const ChatList = ({
  activeTab,
  all,
  followers,
  followings,
  receiver,
  handleSelectReceiver,
}) => {
  const renderList = () => {
    switch (activeTab) {
      // case "all":
      //   return (
      //     <AllUsersList
      //       users={all}
      //       receiver={receiver}
      //       handleSelectReceiver={handleSelectReceiver}
      //     />
      //   );
      case "followers":
        return (
          <FollowersList
            followers={followers}
            receiver={receiver}
            handleSelectReceiver={handleSelectReceiver}
          />
        );
      case "followings":
        return (
          <FollowingsList
            followings={followings}
            receiver={receiver}
            handleSelectReceiver={handleSelectReceiver}
          />
        );
      default:
        return (
          <FollowingsList
            followings={followings}
            receiver={receiver}
            handleSelectReceiver={handleSelectReceiver}
          />
        );
    }
  };

  return <>{renderList()}</>;
};

const FollowersList = ({ followers, receiver, handleSelectReceiver }) => {
  return (
    <>
      {followers && followers?.length > 0
        ? followers.map((follower) => (
            <div
              key={follower?._id?._id}
              className=" flex gap-2 border rounded p-2 items-center cursor-pointer"
              onClick={() => handleSelectReceiver(follower?._id)}
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={follower?._id?.profileUrl}
                alt={follower?._id?.username}
              />
              <div>
                <p
                  className={`${
                    receiver?._id === follower?._id?._id ? "font-bold" : ""
                  }`}
                >
                  {follower?._id?.username}
                </p>
              </div>
            </div>
          ))
        : "No users"}
    </>
  );
};
const FollowingsList = ({ followings, receiver, handleSelectReceiver }) => {
  return (
    <>
      {followings && followings?.length > 0
        ? followings.map((following) => (
            <div
              key={following?._id?._id}
              className=" flex gap-2 border rounded p-2 items-center cursor-pointer"
              onClick={() => handleSelectReceiver(following?._id)}
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={following?._id?.profileUrl}
                alt={following?._id?.username}
              />
              <div>
                <p
                  className={`${
                    receiver?._id === following?._id?._id ? "font-bold" : ""
                  }`}
                >
                  {following?._id?.username}
                </p>
              </div>
            </div>
          ))
        : "No users"}
    </>
  );
};
const AllUsersList = ({ users, receiver, handleSelectReceiver }) => {
  return (
    <>
      {users && users?.length > 0
        ? users.map((user) => (
            <div
              key={user?._id?._id}
              className=" flex gap-2 border rounded p-2 items-center cursor-pointer"
              onClick={() => handleSelectReceiver(user?._id)}
            >
              <img
                className="w-14 h-14 rounded-full object-cover"
                src={user?._id?.profileUrl}
                alt={user?._id?.username}
              />
              <div>
                <p
                  className={`${
                    receiver?._id === user?._id?._id ? "font-bold" : ""
                  }`}
                >
                  {user?._id?.username}
                </p>
              </div>
            </div>
          ))
        : "No users"}
    </>
  );
};
