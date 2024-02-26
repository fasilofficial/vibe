import express from "express";

import {
  authAdmin,
  logoutAdmin,
  registerAdmin,
  getUsers,
  getUser,
  addUser,addPost,
  getPosts,addReport
} from "../controllers/adminController";
import { protectAdmin } from "../middleware/authMiddleware";

const router = express.Router();

// register
router.post("/", registerAdmin);

// login
router.post("/auth", authAdmin);

// logout
router.post("/logout", logoutAdmin);

// get user
router.get("/users", getUsers);

// get posts
router.get("/posts", getPosts);

// get users by username or email
router.get("/users/:credential", getUser);

// add user
router.post("/users", addUser);

// add post
router.post("/posts", addPost);

// add post
router.post("/reports", addReport);

// block/unblock
// router.post("/users/:userId", blockUser);

export default router;
