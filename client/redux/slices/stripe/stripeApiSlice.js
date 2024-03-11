import { apiSlice } from "../apiSlice";

const BASE_URL = "http://localhost:3300/api/v1/stripe";

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
