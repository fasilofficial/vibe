"use client";

import { setUsers } from "@/redux/slices/data/dataSlice";
import { useGetUsersMutation } from "@/redux/slices/user/userApiSlice";
import moment from "moment";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const page = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.data);

  const [getUsers] = useGetUsersMutation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers().unwrap();
        if (res.data) {
          dispatch(setUsers(res.data));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (!users || users?.length <= 0) fetchUsers();
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-4">
      <h1 className="text-2xl font-bold mb-2">Subscriptions</h1>
      <div>
        {users ? (
          <table className="min-w-full divide-y divide-gray-200 shadow-md">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Username
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Expiry Date
                </th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {users.map((user, index) => {
                if (user.bluetick.status) {
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.bluetick.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {moment(user.bluetick.expiryDate).format('L')}
                      </td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </div>
  );
};

export default page;
