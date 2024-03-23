import { SERVER_BASE_URL } from "@/constants";
import { apiSlice } from "../apiSlice";

const BASE_URL = `${SERVER_BASE_URL}/api/v1/stripe`;

export const stripeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCheckoutSession: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/create-checkout-session`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetCheckoutSessionMutation } = stripeApiSlice;
