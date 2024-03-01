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
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Full Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Username
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => (
              <tr key={index} className="bg-white">
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">
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
