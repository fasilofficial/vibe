"use client";

import {
  useGetReportsMutation,
  useResolveReportMutation,
} from "@/app/(redux)/slices/report/reportApiSlice";
import React, { useEffect, useState } from "react";

const Reports = () => {
  const [reports, setReports] = useState();

  const [getReports] = useGetReportsMutation();
  const [resolveReport] = useResolveReportMutation();

  const handleResolve = async (reportId) => {
    const res = await resolveReport(reportId).unwrap();
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === res.report._id ? res.report : report
      )
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      const res = await getReports().unwrap();
      setReports(res);
    };

    fetchReports();
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
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report, index) => (
                <tr
                  key={index}
                  className={report.resolved ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.postId._id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.userId}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.description}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {report.resolved ? (
                      <h2 className="text-green-500">Resolved</h2>
                    ) : (
                      <button
                        type="button"
                        className="text-blue-500"
                        onClick={() => handleResolve(report._id)}
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
