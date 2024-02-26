"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetUsersMutation } from "../(redux)/slices/admin/adminApiSlice";
import { setUsers } from "../(redux)/slices/data/dataSlice";

const Admin = () => {
  return (
    <div>
      <h1>Admin</h1>
    </div>
  );
};

export default Admin;
