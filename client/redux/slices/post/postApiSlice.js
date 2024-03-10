import { apiSlice } from "../apiSlice";

const BASE_URL = "http://localhost:3300/api/v1/posts";

export const postApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.mutation({
      query: () => ({
        url: `${BASE_URL}/`,
        method: "GET",
      }),
    }),
    getPost: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
        method: "GET",
      }),
    }),
    addPost: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
    editPost: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.postId}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deletePost: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data}`,
        method: "DELETE",
      }),
    }),
    likePost: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.postId}/like`,
        method: "POST",
        body: { userId: data.userId },
      }),
    }),
    addComment: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.postId}/comments`,
        method: "POST",
        body: data,
      }),
    }),
    addReply: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.postId}/comments/${data.commentId}`,
        method: "POST",
        body: data,
      }),
    }),
    deleteComment: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.postId}/comments/${data.commentId}`,
        method: "DELETE",
      }),
    }),
    deleteReply: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/${data.postId}/comments/${data.commentId}/replies/${data.replyId}`,
        method: "DELETE",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetPostsMutation,
  useGetPostMutation,
  useAddPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useAddCommentMutation,
  useAddReplyMutation,
  useDeleteCommentMutation,
  useEditPostMutation,
  useDeleteReplyMutation
} = postApiSlice;
