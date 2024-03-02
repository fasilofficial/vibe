import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users:
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("users"))
      : [],
  posts:
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("posts"))
      : [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
      localStorage.setItem("users", JSON.stringify(action.payload));
    },
    removeUsers: (state, action) => {
      state.users = [];
      localStorage.removeItem("users");
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
      localStorage.setItem("posts", JSON.stringify(action.payload));
    },
    removePosts: (state, action) => {
      state.posts = [];
      localStorage.removeItem("posts");
    },
    AddLike: (state, action) => {
      // state.posts = 
    }
  },
});

export const {
  setUsers,
  removeUsers,
  setPosts,
  setPost,
  removePost,
  removePosts,
} = dataSlice.actions;

export default dataSlice.reducer;
