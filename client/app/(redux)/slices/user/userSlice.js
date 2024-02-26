import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  info: null,
  posts: null,
};

const dataSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setInfo: (state, action) => {
      state.info = action.payload;
    },
    removeInfo: (state, action) => {
      state.info = null;
    },
    setUserPosts: (state, action) => {
      state.posts = action.payload;
    },
    removeUserPosts: (state, action) => {
      state.posts = null;
    },
  },
});

export const { setInfo, setUserPosts, removeInfo, removeUserPosts } = dataSlice.actions;

export default dataSlice.reducer;
