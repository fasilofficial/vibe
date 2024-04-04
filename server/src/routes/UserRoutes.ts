import express from "express";

import {
  authUser,
  logoutUser,
  registerUser,
  getUserPosts,
  getUser,
  blockUser,
  getUsers,
  sendOtp,
  handleForgotPassword,
  getFollowings,
  getFollowers,
  followUser,
  unfollowUser,
  getSuggestions,
  getActivities,
  savePost,
  removeFollower,
  editUser,
  addBluetick,
  toggleAccountType,
  handleChangePassword,
} from "../controllers/userController";

import { protect, protectAdmin } from "../middleware/authMiddleware";
import { isBlocked } from "../middleware/isBlocked";

const router = express.Router();

// register
router.post("/", registerUser);

// login
router.post("/auth", authUser);

// logout
router.post("/logout", logoutUser);

// sendOtp
router.post("/sendOtp", sendOtp);

// forgotPassword
router.post("/forgotPassword", handleForgotPassword);

// changePassword
router.post("/changePassword", protect, isBlocked, handleChangePassword);

// get users
router.get("/", getUsers);

// get user posts
router.get("/:userId/posts", getUserPosts);

// block user
router.put("/:userId", protectAdmin, blockUser);

// toggle account type
router.put("/:userId/account-type", protect, isBlocked, toggleAccountType);

// get followings
router.get("/:userId/followings", getFollowings);

// get followers
router.get("/:userId/followers", getFollowers);

// get activities
router.get("/:userId/activities", getActivities);

// follow user
router.post("/:userId/followings", protect, isBlocked, followUser);

// unfollow user
router.delete("/:userId/followings", protect, isBlocked, unfollowUser);

// remove follower
router.delete("/:userId/followers", protect, isBlocked, removeFollower);

// get suggestions
router.get("/:userId/suggestions", getSuggestions);

// save post
router.post("/:userId/saves", protect, isBlocked, savePost);

// get user
router.get("/:id", getUser);

// edit user
router.patch("/:userId", protect, isBlocked, editUser);

// add blue tick
router.post("/:userId/bluetick", protect, isBlocked, addBluetick);

export default router;
