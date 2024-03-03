"use client";

import { setReports } from "@/app/(redux)/slices/data/dataSlice";
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
      res.data ? toast.success(res.message) : toast(res.message);

      // setReports((prevReports) =>
      //   prevReports.map((report) =>
      //     report._id === res.report._id ? res.report : report
      //   )
      // );
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      const res = await getReports().unwrap();
      dispatch(setReports(res.reports));
    };

    if (!reports) {
      fetchReports();
    }
  }, []);

  return (
    <div className="w-full flex items-center flex-col gap-4">
      <h1>Reports Management</h1>
      <div>
        {reports ? (
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
            <thead className="border-b bg-gray-50">
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
            <tbody className="divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr
                  key={report._id}
                  className={report.resolved ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.postId._id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.reports ? (
                      <ul>
                        {report.reports.map((r) => (
                          <p>{r.userId._id}</p>
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
                        onClick={() => handleResolve(report._id, report.postId)}
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
