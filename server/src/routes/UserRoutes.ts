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

// get user
router.get("/:id", getUser);

// get user posts
router.get("/:userId/posts", getUserPosts);

router.put("/:userId", blockUser);

export default router;
