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

router.post("/forgotPassword", handleForgotPassword);

// get users
router.get("/", getUsers);

// get user posts
router.get("/:userId/posts", getUserPosts);

// block user
router.put("/:userId", blockUser);

// get followings
router.get("/:userId/followings", getFollowings);

// get followers
router.get("/:userId/followers", getFollowers);

// follow a user
router.post("/:userId/followings", followUser);

// unfollow a user
router.delete("/:userId/followings", unfollowUser);

// unfollow a user
router.get("/:userId/suggestions", getSuggestions);

// get user
router.get("/:id", getUser);

// unFollow user
// router.delete("/:userId/following/:followingId", unFollowUser);

export default router;
