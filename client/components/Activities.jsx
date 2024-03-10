"use client";

import React, { useEffect, useState } from "react";
import { useGetActivitiesMutation } from "../redux/slices/user/userApiSlice";
import { useSelector } from "react-redux";
import moment from "moment";
const Activities = () => {
  const [activities, setActivities] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [getActivities] = useGetActivitiesMutation();

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
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-4 w-96 mb-4 flex items-center"
          >
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
              </div>
              <div className="text-gray-500">
                {moment(activity.createdAt).startOf("minute").fromNow()}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-gray-500">No new activities</div>
      )}
    </div>
  );
};

// Helper function to format activity time
const formatActivityTime = (createdAt) => {
  // Implement your formatting logic for the activity time
  return createdAt; // Placeholder, replace with actual formatting
};

export default Activities;
