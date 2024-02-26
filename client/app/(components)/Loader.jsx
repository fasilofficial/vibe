"use client";

import React from "react";
import { MutatingDots } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <MutatingDots
        visible={true}
        height="100"
        width="100"
        color="#3B82F6"
        secondaryColor="#3B82F6"
        radius="12.5"
        ariaLabel="mutating-dots-loading"
      />
    </div>
  );
};

export default Loader;
