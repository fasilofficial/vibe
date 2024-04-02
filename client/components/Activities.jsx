"use client";

import React, { useEffect, useState } from "react";
import {
  useFollowUserMutation,
  useGetActivitiesMutation,
} from "../redux/slices/user/userApiSlice";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import {
  updateFollowers,
  updateFollowings,
} from "@/redux/slices/data/dataSlice";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);

  const [getActivities] = useGetActivitiesMutation();
  const [acceptFollowRequest] = useFollowUserMutation();

  const dispatch = useDispatch();

  const handleAcceptFollowRequest = async (
    requestedUserId,
    userId,
    setAccepted
  ) => {
    if (!requestedUserId || !userId) return;

    try {
      const res = await acceptFollowRequest({
        followingId: userId,
        userId: requestedUserId,
        acceptRequest: true,
      }).unwrap();

      if (res.data) {
        dispatch(
          updateFollowings({
            userId: requestedUserId,
            followings: res.data.followings,
          })
        );
        dispatch(
          updateFollowers({
            userId,
            followers: res.data.followers,
          })
        );

        setAccepted(true);
      }
    } catch (error) {
      console.error("Error accepting follow request:", error);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await getActivities(userInfo._id).unwrap();
        setActivities(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchActivities();
  }, [userInfo._id, getActivities]);

  const renderActivityMessage = (activity) => {
    switch (activity.type) {
      case "like":
        return `${activity.by.name} liked your post`;
      case "comment":
        return `${activity.by.name} commented on your post`;
      case "reply":
        return `${activity.by.name} replied to your comment`;
      case "follow":
        return `${activity.by.name} started following you`;
      case "follow_request":
        return `${activity.by.name} requested to follow`;
      case "report":
        return "Admin deleted your post due to excessive reports";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col mt-6">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <ActivityCard
            key={index}
            renderActivityMessage={renderActivityMessage}
            activity={activity}
            handleAcceptFollowRequest={handleAcceptFollowRequest}
          />
        ))
      ) : (
        <div className="text-gray-500">No new activities</div>
      )}
    </div>
  );
};

export default Activities;

function ActivityCard({
  renderActivityMessage,
  activity,
  handleAcceptFollowRequest,
}) {
  const [accepted, setAccepted] = useState(false);
  const [declined, setDeclined] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-96 mb-4 flex items-center">
      <img
        src={
          activity.type === "report"
            ? "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthelightingagency.com%2Fwp-content%2Fuploads%2F2017%2F01%2Fperson-placeholder-lg-500x473.png&f=1&nofb=1&ipt=e890144c8b490f3f168d30e1b91e2ebd517b30b1074fb5c94572c3e7f181a67a&ipo=images"
            : activity.by?.profileUrl
        } // User's profile photo URL
        alt={activity.type === "report" ? "Admin" : activity.by?.name} // Alt text for accessibility
        className="w-10 h-10 rounded-full object-cover mr-4"
      />
      <div className="flex flex-col">
        <div className="text-lg font-bold mb-2">
          {renderActivityMessage(activity)}
          {activity.type === "follow_request" && (
            <div className="flex gap-4 mt-2">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded"
                onClick={() => {
                  handleAcceptFollowRequest(
                    activity.by?._id,
                    activity.userId,
                    setAccepted
                  );
                }}
                disabled={accepted || declined}
              >
                {accepted ? "Accepted" : "Accept"}
              </button>
              <button onClick={() => setDeclined(true)} disabled={accepted || declined}>
                {declined ? "Declined" : "Decline"}
              </button>
            </div>
          )}
        </div>
        <div className="text-gray-500">
          {moment(activity.createdAt).startOf("minute").fromNow()}
        </div>
      </div>
    </div>
  );
}
