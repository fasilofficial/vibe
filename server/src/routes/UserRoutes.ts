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

import { protect } from "../middleware/authMiddleware";

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
router.post("/changePassword", handleChangePassword);

// get users
router.get("/", getUsers);

// get user posts
router.get("/:userId/posts", getUserPosts);

// block user
router.put("/:userId", blockUser);

// toggle account type
router.put("/:userId/account-type", toggleAccountType);

// get followings
router.get("/:userId/followings", getFollowings);

// get followers
router.get("/:userId/followers", getFollowers);

// get activities
router.get("/:userId/activities", getActivities);

// follow user
router.post("/:userId/followings", followUser);

// unfollow user
router.delete("/:userId/followings", unfollowUser);

// remove follower
router.delete("/:userId/followers", removeFollower);

// get suggestions
router.get("/:userId/suggestions", getSuggestions);

// save post
router.post("/:userId/saves", savePost);

// get user
router.get("/:id", getUser);

// edit user
router.patch("/:userId", editUser);

// add blue tick
router.post("/:userId/bluetick", addBluetick);

export default router;
