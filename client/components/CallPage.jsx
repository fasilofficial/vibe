"use client";

import { useSocket } from "@/providers/SocketProvider";
import { selectUser } from "@/redux/selectors";
import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CallNotification from "./CallNotification";

const CallPage = () => {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [ringing, setRinging] = useState(false);

  const [callEnded, setCallEnded] = useState(false);

  const [name, setName] = useState("");

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  const searchParams = useSearchParams();
  const receiverId = searchParams.get("receiverId");
  const fromId = searchParams.get("fromId");

  const { userInfo } = useSelector((state) => state.auth);
  const { user } = useSelector(selectUser(userInfo?._id));
  const { user: receiver } = useSelector(selectUser(receiverId));

  const [idToCall, setIdToCall] = useState(receiver?.username);

  const socket = useSocket();

  const router = useRouter();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
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
  }, [socket]);

  const callUser = (receiverName) => {
    setRinging(true);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket?.emit("callUser", {
        userToCall: receiverName,
        signalData: data,
        from: user?.username,
      });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    socket?.on("callAccepted", (signal) => {
      setCallAccepted(true);
      setRinging(false);
      peer.signal(signal);
    });

    socket?.on("callDeclined", () => {
      setRinging(false);
      toast("Call Declined");
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket?.emit("answerCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    setCallAccepted(false);
    router.push("/chat");
  };

  const cancelCall = () => {
    setRinging(false);
    socket?.emit("cancelCall", { to: idToCall });
  };

  const declineCall = () => {
    setReceivingCall(false);
    socket?.emit("declineCall", { to: caller });
  };

  useEffect(() => {
    setIdToCall(receiver?.username);
  }, [receiver]);

  return (
    <div className="w-4/6 h-[90%] ml-36 p-4 border my-4">
      <div className="w-full h-5/6 bg-slate-200 relative flex justify-center items-center">
        {callAccepted && !callEnded ? (
          <>
            <div className="absolute left-0 top-0 h-40 flex justify-center items-center z-10">
              <video
                playsInline
                ref={myVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 flex justify-center items-center">
              <video
                playsInline
                muted
                ref={userVideo}
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex justify-center items-center">
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex flex-col mx-auto">
          {!callAccepted ? (
            <input
              id="filled-basic"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
              placeholder="Call ID"
              className="border border-gray-300 rounded px-2 py-1 mb-2 hidden"
            />
          ) : null}

          <div className="flex justify-center items-center">
            {callAccepted && !callEnded ? (
              <button
                onClick={leaveCall}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                End Call
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => callUser(idToCall)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  {ringing ? "Ringing..." : "Start Call"}
                </button>
                {ringing && (
                  <button
                    onClick={cancelCall}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {receivingCall && !callAccepted ? (
        <CallNotification
          name={name}
          declineCall={declineCall}
          answerCall={answerCall}
        />
      ) : null}
    </div>
  );
};

export default CallPage;
