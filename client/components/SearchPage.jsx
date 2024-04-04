"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

import SearchIcon from "@mui/icons-material/Search";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useGetUserBySearchTermMutation } from "@/redux/slices/user/userApiSlice";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultUsers, setResultUsers] = useState([]);

  const [getUsers] = useGetUserBySearchTermMutation()

  const { users } = useSelector((state) => state.data);

  const handleChange = async (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") return setResultUsers(users);

    const res = await getUsers(searchTerm).unwrap()

    setResultUsers(res.data);
  };

  useEffect(() => setResultUsers(users), [users]);

  return (
    <div className="ml-36 p-4 border w-2/6 my-4 flex flex-col gap-4">
      <div className="flex gap-2 items-center w-full p-2 bg-white dark:bg-gray-700 rounded border">
        <SearchIcon className="text-gray-600" />
        <input
          type="text"
          placeholder="Search by username, name or email"
          className=" focus:outline-none flex-grow dark:bg-gray-700 "
          value={searchTerm}
          onChange={handleChange}
        />
        <BackspaceIcon
          className="text-gray-600 cursor-pointer text-sm"
          onClick={() => {
            setSearchTerm("");
            setResultUsers(users);
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        {resultUsers.length > 0 &&
          resultUsers.map((user,index) => (
            <div key={index} className="p-2 flex gap-2 border items-center">
              <img
                src={user.profileUrl}
                alt={user.name}
                className="w-12 h-12 object-cover object-center rounded-full"
              />
              <Link
                href={`/profile/${user._id}`}
                className="text-md hover:font-semibold"
              >
                {user.username}
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
