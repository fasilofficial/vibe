import { apiSlice } from "../apiSlice";

const BASE_URL = `http://${process.env.HOST}:3300/api/v1/users`;

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
    editUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.userId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    getUserByEmail: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}?email=${data}`,
        method: "GET",
      }),
    }),
    blockUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
        method: "PUT",
      }),
    }),
    toggleAccountType: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}/account-type`,
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
    getFollowings: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}/followings`,
        method: "GET",
      }),
    }),
    getFollowers: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}/followers`,
        method: "GET",
      }),
    }),
    getActivities: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}/activities`,
        method: "GET",
      }),
    }),
    savePost: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.userId}/saves`,
        method: "POST",
        body: data,
      }),
    }),
    unfollowUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.userId}/followings`,
        method: "DELETE",
        body: data,
      }),
    }),
    removeFollower: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.userId}/followers`,
        method: "DELETE",
        body: data,
      }),
    }),
    followUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.userId}/followings`,
        method: "POST",
        body: data,
      }),
    }),
    addBluetick: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.userId}/bluetick`,
        method: "POST",
        body: { type: data.type },
      }),
    }),
    getUser: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
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
  useBlockUserMutation,
  useSendOtpMutation,
  useForgotPasswordMutation,
  useGetUserByEmailMutation,
  useGetUserMutation,
  useGetFollowingsMutation,
  useGetFollowersMutation,
  useGetActivitiesMutation,
  useSavePostMutation,
  useUnfollowUserMutation,
  useFollowUserMutation,
  useRemoveFollowerMutation,
  useEditUserMutation,
  useAddBluetickMutation,
  useToggleAccountTypeMutation,
} = usersApiSlice;
