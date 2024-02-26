import React from "react";

const ExplorePost = ({ first, post }) => {
  return (
    <div className={`object-cover ${first ? "col-span-2 row-span-2" : "h-60"}`}>
      <img
        className="h-full w-full object-cover hover:scale-[1.005] cursor-pointer rounded-md"
        src={post.imageUrl}
      />
    </div>
  );
};

export default ExplorePost;
