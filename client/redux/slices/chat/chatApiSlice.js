import { apiSlice } from "../apiSlice";

const BASE_URL = `http://${process.env.HOST}:3300/api/v1/chats`;

export const reportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/`,
        method: "GET",
      }),
    }),
    addChat: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetChatsMutation, useAddChatMutation } = reportApiSlice;
