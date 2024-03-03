import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts:
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("userPosts"))
      : [],
};

const dataSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserPosts: (state, action) => {
      state.posts = action.payload;
      localStorage.setItem("userPosts", JSON.stringify(action.payload));
    },
    removeUserPosts: (state, action) => {
      state.posts = [];
      localStorage.removeItem("userPosts");
    },
  },
});

export const { setUserPosts, removeUserPosts } = dataSlice.actions;

export default dataSlice.reducer;
