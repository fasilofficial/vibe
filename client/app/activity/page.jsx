import React from "react";
import UserLayout from "../(components)/UserLayout";
import Activities from "../(components)/Activities";

const Activity = () => {
  return (
    <UserLayout>
      <div className="ml-36 p-4">
        <Activities />
      </div>
    </UserLayout>
  );
};

export default Activity;
