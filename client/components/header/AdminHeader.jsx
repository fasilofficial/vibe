import React from "react";

const AdminHeader = ({ adminInfo }) => {
  return (
    <header className="w-full h-20 bg-white dark:bg-gray-900 flex items-center justify-end px-6 py-4">
      {adminInfo && <h2>{adminInfo?.name}</h2>}
    </header>
  );
};

export default AdminHeader;
