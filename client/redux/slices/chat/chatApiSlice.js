import { SERVER_BASE_URL } from "@/constants";
import { apiSlice } from "../apiSlice";

const BASE_URL = `${SERVER_BASE_URL}/api/v1/chats`;

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
