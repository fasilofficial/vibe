import Activities from "@/components/Activities";
import UserLayout from "@/components/UserLayout";
import React from "react";

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
