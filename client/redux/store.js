import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./slices/data/dataSlice";
import authReducer from "./slices/auth/authSlice";
import { apiSlice } from "./slices/apiSlice";

const store = configureStore({
  reducer: {
    data: dataReducer,
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
