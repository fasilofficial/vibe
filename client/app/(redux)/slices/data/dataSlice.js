import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  posts: [],
  reports: [],
  chats: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setReports: (state, action) => {
      state.reports = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },

    removeUsers: (state, action) => {
      state.users = [];
    },
    removePosts: (state, action) => {
      state.posts = [];
    },
    removeReports: (state, action) => {
      state.reports = [];
    },
    removeChats: (state, action) => {
      state.chats = [];
    },

    addReport: (state, action) => {
      state.reports = [...state.reports, action.payload];
    },
    addPost: (state, action) => {
      state.posts = [...state.posts, action.payload];
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

    updateUser: (state, action) => {
      const { userId, updatedUser } = action.payload;
      state.users = state.users.map((user) => {
        if (user._id === userId) {
          return updatedUser;
        }
        return user;
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

    updateReport: (state, action) => {
      const { postId, updatedReport } = action.payload;
      state.reports = state.reports.map((report) => {
        if (report.postId === postId || report.postId?._id === postId) {
          return updatedReport;
        }
        return report;
      });
    },
  },
});

export const {
  setUsers,
  setPosts,
  setReports,
  setChats,

  removeUsers,
  removePosts,
  removeReports,
  removeChats,

  updatePost,

  updateLikes,
  updateComments,

  updateUser,
  updateFollowers,
  updateFollowings,

  updateSaves,

  removePost,

  updateReport,

  addReport,
  addPost,
} = dataSlice.actions;

export default dataSlice.reducer;
