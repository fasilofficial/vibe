"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { selectChats, selectUser } from "../redux/selectors";
import { useSelector, useDispatch } from "react-redux";
import { useGetChatsMutation } from "../redux/slices/chat/chatApiSlice";
import { addChat, setChats, setUsers } from "../redux/slices/data/dataSlice";
import { IoSend } from "react-icons/io5";
import moment from "moment";
import Link from "next/link";
import { useGetUsersMutation } from "../redux/slices/user/userApiSlice";
import { useSocket } from "@/providers/SocketProvider";
import VideocamIcon from "@mui/icons-material/Videocam";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/navigation";
import CallNotification from "./CallNotification";

const ChatPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo._id));
  const socket = useSocket();

  const [receiver, setReceiver] = useState();

  const { chats } = useSelector(selectChats(userInfo?._id, receiver?._id));

  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("followings");
  const [image, setImage] = useState(null);
  const [sendingImage, setSendingImage] = useState(false);
  const [page, setPage] = useState(10);

  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [name, setName] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [getChats] = useGetChatsMutation();
  const [getUsers] = useGetUsersMutation();

  const canvasRef = useRef();

  const dispatch = useDispatch();

  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSelectReceiver = (receiver) => {
    setReceiver(receiver);
  };

  const handleSendMessage = async (message, sender, receiver) => {
    if (message.trim() === "" || !message || !sender || !receiver) return;

    const data = {
      message,
      sender,
      receiver,
    };

    try {
      socket.emit("message", data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setMessage("");
    }
  };

  const handleSendMedia = async (image, sender, receiver) => {
    if (!image) return;

    setSendingImage(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "z0o48jjp");
    formData.append("cloud_name", "fasils");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/fasils/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const resData = await response.json();

      const imageUrl = resData.secure_url;

      const data = {
        message: imageUrl,
        sender,
        receiver,
      };

      socket.emit("message", data);
    } catch (error) {
      console.error("Error sending image", error);
    } finally {
      setSendingImage(false);
    }
  };

  const dispatchAddChat = useCallback(
    (chat) => {
      dispatch(addChat(chat));
    },
    [dispatch]
  );

  const handleShowPrevChats = () => {
    setPage((prev) => prev + 10);
  };

  const answerCall = () => {
    setReceivingCall(false);

    router.push("/chat/call");
  };

  const declineCall = () => {
    setReceivingCall(false);
    socket?.emit("declineCall", { to: caller });
  };

  useEffect(() => {
    socket?.on("message", (chat) => {
      dispatchAddChat(chat);

      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
        }
      }, 100);
    });

    socket?.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    socket?.on("callCanceled", () => {
      setReceivingCall(false);
      setCaller("");
      setName("");
      setCallerSignal(null);
    });

    socket?.on("onlineUsers", (data) => {
      setOnlineUsers(data);
    });

    const fetchOnlineUsers = () => {
      socket?.emit("getOnlineUsers", null);
    };

    // fetchOnlineUsers()
  }, [socket]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getChats().unwrap();
        if (res.data) {
          dispatch(setChats(res.data));
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
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

    if (!user) fetchUsers();
    if (!chats || chats?.length <= 0) fetchChats();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
    }
  }, [receiver]);

  return (
    <div className="w-4/6 ml-36 mt-4 h-screen">
      <div className="flex gap-4 h-[96%]">
        <div className="flex flex-col gap-2 min-w-64 p-2 dark:bg-gray-800 shadow-md rounded-sm">
          <NavigationPanel activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex flex-col gap-2">
            <ChatList
              activeTab={activeTab}
              followers={user?.followers}
              followings={user?.followings}
              receiver={receiver}
              handleSelectReceiver={handleSelectReceiver}
            />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-2 w-full p-2 border ">
          {receivingCall ? (
            <CallNotification
              name={name}
              declineCall={declineCall}
              answerCall={answerCall}
            />
          ) : null}

          {receiver ? (
            <>
              <div className="flex-none flex  border justify-between rounded p-2 items-center w-full cursor-pointer">
                <div className="flex gap-2 items-center">
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

                <Link
                  href={`/chat/call?receiverId=${receiver?._id}`}
                  className="hover:scale-105"
                >
                  <VideocamIcon />
                </Link>
              </div>

              <div
                ref={canvasRef}
                className="flex flex-grow flex-col gap-4 bg-white dark:bg-gray-800 min-h-96 overflow-y-scroll p-2"
              >
                {page > chats.length ? (
                  <p className="text-center text-gray-500 text-sm">
                    End of chat
                  </p>
                ) : (
                  <button onClick={handleShowPrevChats} className="mx-auto">
                    <KeyboardArrowUpIcon />
                  </button>
                )}

                {chats
                  .reverse()
                  .slice(0, page)
                  .reverse()
                  .map((chat, index) => (
                    <div
                      key={chat?._id || index}
                      className={`w-full flex ${
                        chat?.sender?._id === user?._id
                          ? "justify-end"
                          : "justify-start"
                      } `}
                    >
                      <div
                        className={` min-w-80  max-w-96 flex gap-2`}
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
                              {chat?.message?.includes("cloudinary") ? (
                                <img
                                  src={chat.message}
                                  className="w-full rounded-sm"
                                />
                              ) : (
                                <p>{chat?.message}</p>
                              )}

                              <p className="text-right text-xs text-gray-500 mt-1">
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
                              {chat?.message?.includes("cloudinary") ? (
                                <img
                                  src={chat.message}
                                  className="w-full rounded-sm"
                                />
                              ) : (
                                <p>{chat?.message}</p>
                              )}
                              <p className="text-right text-xs text-gray-500 mt-1">
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
                <div className="flex gap-4 items-center">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type="text"
                    name="message"
                    placeholder="Enter message"
                    className="dark:bg-gray-700 p-2 text-gray-800 rounded-sm flex-1 outline-none border border-gray-300 focus:border-gray-400 "
                  />

                  <button
                    onClick={() => handleSendMessage(message, user, receiver)}
                    className="p-2 rounded-full h-12 w-12 flex justify-center items-center cursor-pointer border-black bg-blue-800 text-white"
                    type="button"
                  >
                    <IoSend />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <span className="text-gray-700">Upload Image</span>
                    <input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleSendMedia(image, user, receiver)}
                    className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                    type="button"
                    disabled={sendingImage}
                  >
                    {sendingImage ? "Sending..." : "Send"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full">Select a user and start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;

const ChatList = ({
  activeTab,
  followers,
  followings,
  receiver,
  handleSelectReceiver,
}) => {
  const renderList = () => {
    switch (activeTab) {
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
                  onClick={() => handleSelectReceiver(follower?._id)}
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

const NavigationPanel = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-between items-center w-full border-b py-2">
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
  );
};
