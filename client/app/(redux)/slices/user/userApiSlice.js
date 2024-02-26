import { apiSlice } from "../apiSlice";

const BASE_URL = "http://localhost:3300/api/v1/users";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/logout`,
        method: "POST",
      }),
    }),
    getUsers: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/`,
        method: "GET",
      }),
    }),
    getUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
        method: "GET",
      }),
    }),
    blockUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
        method: "PUT",
      }),
    }),
    sendOtp: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/sendOtp`,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/forgotPassword`,
        method: "POST",
        body: data,
      }),
    }),
    getUserPosts: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}/posts`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useLogoutMutation,
  useGetUserPostsMutation,
  useGetUsersMutation,
  useGetUserMutation,
  useBlockUserMutation,
  useSendOtpMutation,
  useForgotPasswordMutation,
} = usersApiSlice;
