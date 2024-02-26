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
          <table className="border">
            <thead className="border-b">
              <tr>
                <th className="p-2">PostID</th>
                <th className="p-2">UserId</th>
                <th className="p-2">Description</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => (
                <tr>
                  <td className="px-2">{report.postId._id}</td>
                  <td className="px-2">{report.userId}</td>
                  <td className="px-2">{report.description}</td>
                  <td className="px-2">
                    {report?.resolved ? (
                      <h2 className=" text-green-500  ">Resolved</h2>
                    ) : (
                      <button
                        type="button"
                        className=" text-blue-500 "
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
