"use client";

import { useGetPostsMutation } from "@/redux/slices/post/postApiSlice";
import { useGetReportsMutation } from "@/redux/slices/report/reportApiSlice";
import { useGetUsersMutation } from "@/redux/slices/user/userApiSlice";
import { useEffect, useState } from "react";
import { GoReport } from "react-icons/go";
import { IoIosPeople } from "react-icons/io";
import { TiDocumentText } from "react-icons/ti";

const StatBox = ({ icon, text }) => {
  return (
    <div className="shadow p-2 rounded flex justify-between h-36 items-center">
      <i className="text-5xl">{icon}</i>
      <p>{text}</p>
    </div>
  );
};

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);

  const [getUsers] = useGetUsersMutation();
  const [getPosts] = useGetPostsMutation();
  const [getReports] = useGetReportsMutation();

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const res1 = await getUsers().unwrap();
        const res2 = await getPosts().unwrap();
        const res3 = await getReports().unwrap();

        if (res1.data) setUsers(res1.data);
        if (res2.data) setPosts(res2.data);
        if (res3.data) setReports(res3.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStatsData();
  }, []);

  return (
    <div>
      {users && posts && reports ? (
        <div className="grid md:grid-cols-2 w-full gap-2">
          <div className="grid grid-cols-3 gap-2">
            <StatBox icon={<IoIosPeople />} text={users.length + " Users"} />
            <StatBox icon={<TiDocumentText />} text={posts.length + " Posts"} />
            <StatBox icon={<GoReport />} text={reports.length + " Reports"} />
          </div>
          <div className="shadow p-2">
            <h2 className="font-bold">Latest Users</h2>
            <div className="flex flex-col gap-2">
              {users
                .slice(users.length - 3)
                .reverse()
                .map((user) => (
                  <div className="flex gap-2 items-center p-1 border">
                    <img
                      className="w-12 h-12 rounded-full object-cover object-center"
                      src={user.profileUrl}
                    />
                    <p>{user.username}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};
export default Admin;
