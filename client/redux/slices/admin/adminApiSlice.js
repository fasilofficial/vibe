import { SERVER_BASE_URL } from "@/constants";
import { apiSlice } from "../apiSlice";

const BASE_URL = `${SERVER_BASE_URL}/api/v1/admin`;

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminSignup: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    adminSignin: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    adminLogout: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAdminSignupMutation,
  useAdminSigninMutation,
  useAdminLogoutMutation,
} = adminApiSlice;
