import { SERVER_BASE_URL } from "@/constants";
import { apiSlice } from "../apiSlice";

const BASE_URL = `${SERVER_BASE_URL}/api/v1/reports`;

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/`,
        method: "GET",
      }),
    }),
    getReport: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
        method: "GET",
      }),
    }),
    addReport: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    resolveReport: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.reportId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetReportsMutation,
  useGetReportMutation,
  useAddReportMutation,
  useResolveReportMutation,
} = reportApiSlice;
