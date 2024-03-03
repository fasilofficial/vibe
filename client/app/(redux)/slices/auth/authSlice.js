import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminInfo:
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("adminInfo"))
      : null,
  userInfo:
    typeof window !== "undefined"
      ? JSON.parse(window.localStorage.getItem("userInfo"))
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state, action) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setAdminCredentials: (state, action) => {
      state.adminInfo = action.payload;
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    adminLogout: (state, action) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
    updateFollowings: (state, action) => {
      return {
        ...state,
        userInfo: { ...state.userInfo, followings: action.payload },
      };
    },
    updateFollowers: (state, action) => {
      return {
        ...state,
        userInfo: { ...state.userInfo, followers: action.payload },
      };
    },
  },
});

export const {
  setCredentials,
  logout,
  setAdminCredentials,
  adminLogout,
  updateFollowings,
  updateFollowers
} = authSlice.actions;

export default authSlice.reducer;
