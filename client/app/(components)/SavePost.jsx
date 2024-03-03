import React from "react";
import TurnedInIcon from "@mui/icons-material/TurnedIn";
import Link from "next/link";

const SavePost = ({ post, user, handleSavePost }) => {
  return (
    <div key={post?._id?._id} className="bg-white rounded shadow-md">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <img
            src={post?._id?.creator?.profileUrl}
            alt="Profile"
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-gray-800">
            <Link href={`/profile/${post?._id?.creator?._id}`}>
              {post?._id?.creator.username}
            </Link>
          </span>
        </div>
        <img
          src={post?._id?.imageUrl}
          alt="Post"
          className="w-full rounded h-64 object-cover"
        />
        <div className="flex justify-between items-center">
          <p className="text-gray-700 mt-4">{post?._id?.caption}</p>
          <div
            className="cursor-pointer"
            onClick={() => handleSavePost(post._id._id, user._id)}
          >
            <TurnedInIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavePost;
