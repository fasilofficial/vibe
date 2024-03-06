"use client";

import { setReports, updateReport } from "@/app/(redux)/slices/data/dataSlice";
import {
  useGetReportsMutation,
  useResolveReportMutation,
} from "@/app/(redux)/slices/report/reportApiSlice";
import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

const Reports = () => {
  const { reports } = useSelector((state) => state.data);

  const dispatch = useDispatch();

  const [getReports] = useGetReportsMutation();
  const [resolveReport] = useResolveReportMutation();

  const handleResolve = async (reportId, postId) => {
    if (!reportId || !postId) return;

    try {
      const res = await resolveReport({ reportId, postId }).unwrap();
      console.log(res);
      if (res.data) {
        dispatch(updateReport({ postId, updatedReport: res.data }));
        res.data ? toast.success(res.message) : toast(res.message);
      } else {
        toast(res.message);
      }
    } catch (error) {
      console.error("Error resolving post:", error);
      toast.error(error?.data?.message || error?.message);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getReports().unwrap();
        if (res.data) {
          dispatch(setReports(res.data));
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    if (!reports || reports?.length <= 0) fetchReports();
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-4">
     <h1 className="text-2xl font-bold mb-2">Report Management</h1>
      <div>
        {reports ? (
          <table className="min-w-full divide-y divide-gray-200 shadow-md">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  PostID
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  UserId
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  No. of Reports
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className=" divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr
                  key={report._id}
                  className={
                    report.resolved
                      ? "bg-gray-100 dark:bg-gray-800" 
                      : "bg-white dark:bg-gray-700"
                  }
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.postId?._id || "Post deleted"}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.reports ? (
                      <ul>
                        {report.reports.map((r) => (
                          <p>{r.userId?._id}</p>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.reports ? (
                      <ul>
                        {report.reports.map((r) => (
                          <p>{r.description}</p>
                        ))}
                      </ul>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.reports.length}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.resolved ? (
                      <h2 className="text-green-500">Resolved</h2>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-500"
                        onClick={() =>
                          handleResolve(report._id, report.postId?._id)
                        }
                      >
                        Resolve
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

export default Reports;
