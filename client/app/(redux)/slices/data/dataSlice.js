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
  posts:
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("reports"))
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
    setReports: (state, action) => {
      state.reports = action.payload;
      localStorage.setItem("reports", JSON.stringify(action.payload));
    },
    removeReports: (state, action) => {
      state.reports = [];
      localStorage.removeItem("reports");
    },
    updatePost: (state, action) => {
      const { postId, updatedPost } = action.payload;
      state.posts = state.posts.map((post) => {
        if (post._id === postId) {
          return updatedPost;
        }
        return post;
      });
    },
    updateLikes: (state, action) => {
      const { postId, likes } = action.payload;
      state.posts = state.posts.map((post) => {
        if (post._id === postId) {
          return { ...post, likes };
        }
        return post;
      });
    },
    updateComments: (state, action) => {
      const { postId, comments } = action.payload;
      state.posts = state.posts.map((post) => {
        if (post._id === postId) {
          return { ...post, comments };
        }
        return post;
      });
    },
    updateFollowings: (state, action) => {
      const { userId, followings } = action.payload;
      state.users = state.users.map((user) => {
        if (user._id === userId) {
          return { ...user, followings };
        }
        return user;
      });
    },
    updateFollowers: (state, action) => {
      const { userId, followers } = action.payload;
      state.users = state.users.map((user) => {
        if (user._id === userId) {
          return { ...user, followers };
        }
        return user;
      });
    },
    updateSaves: (state, action) => {
      const { userId, saves } = action.payload;
      state.users = state.users.map((user) => {
        if (user._id === userId) {
          return { ...user, saves };
        }
        return user;
      });
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post._id !== action.payload);
    },
  },
});

export const {
  setUsers,
  removeUsers,

  setPosts,
  removePosts,

  updatePost,

  setReports,
  removeReports,

  updateLikes,
  updateComments,

  updateFollowers,
  updateFollowings,

  updateSaves,

  removePost,
} = dataSlice.actions;

export default dataSlice.reducer;
