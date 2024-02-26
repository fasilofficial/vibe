import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: null,
  posts: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    removeUsers: (state, action) => {
      state.users = null;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    removePosts: (state, action) => {
      state.posts = null;
    },
  },
});

export const { setUsers, removeUsers, setPosts, removePosts } =
  dataSlice.actions;

export default dataSlice.reducer;
