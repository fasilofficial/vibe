import React from "react";

const Public = () => {
  return (
    <div className="flex flex-col items-center">
      <h1>Public</h1>
      <p>Anyone can acccess this page. No need of authentication</p>
      <img
        className=" w-80 h-80 object-cover rounded-full mt-6"
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp9414303.jpg&f=1&nofb=1&ipt=48832bf91f80742f60c554ea60ad37372255db23d9079671435c64c0dcd2da9a&ipo=images"
      />
    </div>
  );
};

export default Public;
