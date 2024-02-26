import React from "react";

const Denied = () => {
  return (
    <div className="flex justify-center items-center flex-col gap-4 w-screen h-screen">
      <h1 className="text-red-500 text-2xl ">Access Denied</h1>
      <p>Only admin have access to this page</p>
    </div>
  );
};

export default Denied;