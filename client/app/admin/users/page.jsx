"use client";

import {
  useBlockUserMutation,
  useGetUsersMutation,
} from "@/app/(redux)/slices/user/userApiSlice";
import React, { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState();

  const [getUsers] = useGetUsersMutation();
  const [blockUser] = useBlockUserMutation();

  const handleBlock = async (userId) => {
    const res = await blockUser(userId).unwrap();
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user._id === res.user._id ? res.user : user))
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers().unwrap();
      setUsers(res);
    };
    fetchUsers();
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-4">
      <h1>User Management</h1>
      <div>
        {users ? (
          <table className="border">
            <thead className="border-b">
              <tr>
                <th className="p-2">Full Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Username</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr>
                  <td className="px-2">{user.name}</td>
                  <td className="px-2">{user.email}</td>
                  <td className="px-2">{user.username}</td>
                  <td className="px-2">
                    {user.blocked ? (
                      <button
                        type="button"
                        className="text-green-500"
                        onClick={() => handleBlock(user._id)}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleBlock(user._id)}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default Users;
