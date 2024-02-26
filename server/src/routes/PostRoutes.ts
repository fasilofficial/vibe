import express from "express";

import {
  addComment,
  deleteComment,
  getPosts,
  likePost,
  deletePost,
  getPost,
  addPost,
  editPost,
} from "../controllers/postController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// get posts
router.get("/", getPosts);

// get posts
router.delete("/:postId", deletePost);

router.post('/',addPost)

router.patch("/:id", editPost);

// add comment
router.post("/:postId/comments", addComment);

// delete comment
router.delete("/:postId/comments/:commentId", deleteComment);

// toggle like
router.post("/:postId/like", likePost);

router.get("/:id", getPost);

export default router;
