import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post";
import Activity from "../models/Activity";
import { Request, Response } from "express";

export const getUserPosts = expressAsyncHandler(async (req, res) => {
  const { creator } = req.query;

  if (creator) {
    const posts = await Post.find({ creator });
    res.status(200).json(posts);
  } else {
    const posts = await Post.find({});
    res.status(200).json(posts);
  }
});

// add post
export const addPost = expressAsyncHandler(async (req, res): Promise<void> => {
  try {
    const newPostData = { ...req.body };

    const newPost = new Post(newPostData);

    const createdPost = await newPost.save();

    await createdPost.populate({
      path: "creator",
      model: "User",
    });
    await createdPost.populate({
      path: "comments.userId",
      model: "User",
    });
    await createdPost.populate({
      path: "comments.replies.userId",
      model: "User",
    });

    res.status(201).json({
      message: "Post created",
      data: { ...createdPost, comments: createdPost.comments.reverse() },
    });
  } catch (error) {
    console.error("Error occurred while adding post:", error);
    res.status(500).json({ message: "Failed to add post" });
  }
});

// get posts
export const getPosts = expressAsyncHandler(async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({
        path: "creator",
        model: "User",
      })
      .populate({
        path: "comments.userId",
        model: "User",
      })
      .populate({
        path: "comments.replies.userId",
        model: "User",
      })
      .sort({ createdAt: -1 });

    if (posts.length > 0) {
      res.status(200).json({
        data: posts.map((post: any) => ({
          ...post._doc,
          comments: post.comments.reverse(),
        })),
      });
    } else {
      throw new Error("Posts not found");
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// add comment
export const addComment = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId, comment }: { userId: string; comment: string } = req.body;
    const { postId } = req.params;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      post.comments.push({ userId, comment, replies: [] });

      if (userId !== post.creator.toString()) {
        const activity = new Activity({
          type: "comment",
          by: userId,
          userId: post.creator,
        });
        await activity.save();
      }

      await post.save();

      await post.populate({
        path: "creator",
        model: "User",
      });
      await post.populate({
        path: "comments.userId",
        model: "User",
      });
      await post.populate({
        path: "comments.replies.userId",
        model: "User",
      });

      res.status(201).json({
        message: "Comment added successfully",
        data: post.comments.reverse(),
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// like post
export const likePost = expressAsyncHandler(
  async (req: any, res): Promise<void> => {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    let message;

    if (post) {
      const userIdIndex = post.likes.indexOf(userId);

      if (userIdIndex !== -1) {
        // User has already liked the post
        post.likes.splice(userIdIndex, 1); // Remove the like
        message = "disliked";
      } else {
        post.likes.push(userId); // Add the like
        message = "liked";

        if (userId !== post.creator) {
          const activity = new Activity({
            type: "like",
            by: userId,
            userId: post.creator,
          });
          await activity.save();
        }
      }

      await post.save();

      res.status(200).json({ message, data: post.likes }); // Send a success response
    } else {
      res.status(404).send("Post not found");
    }
  }
);

// delete comment
export const deleteComment = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId, commentId } = req.params;

    try {
      const post = await Post.findById(postId).populate({
        path: "creator",
        model: "User",
      });

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const commentIndex = post.comments.findIndex(
        (comment: any) => String(comment._id) === commentId
      );

      if (commentIndex === -1) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }

      post.comments.splice(commentIndex, 1);
      await post.save();

      await post.populate({
        path: "comments.userId",
        model: "User",
      });
      await post.populate({
        path: "comments.replies.userId",
        model: "User",
      });

      res.status(200).json({
        message: "Comment deleted successfully",
        data: post.comments.reverse(),
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// delete post
export const deletePost = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res
      .status(200)
      .json({ message: "Post deleted successfully", data: deletedPost });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get post
export const getPost = expressAsyncHandler(async (req: any, res: any) => {
  const { id: postId } = req.params;

  const post: any = await Post.findById(postId)
    .populate({
      path: "creator",
      model: "User",
    })
    .populate({
      path: "comments.userId",
      model: "User",
    })
    .populate({
      path: "comments.replies.userId",
      model: "User",
    });

  if (post) {
    res
      .status(200)
      .json({ data: { ...post._doc, comments: post.comments.reverse() } });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// edit post
export const editPost = expressAsyncHandler(async (req: any, res: any) => {
  const { id: postId } = req.params;

  try {
    const updatedPost: any = await Post.findByIdAndUpdate(
      postId,
      req.body.newPost,
      {
        new: true,
      }
    );

    if (updatedPost) {
      await updatedPost.populate({
        path: "creator",
        model: "User",
      });
      await updatedPost.populate({
        path: "comments.userId",
        model: "User",
      });
      await updatedPost.populate({
        path: "comments.replies.userId",
        model: "User",
      });

      return res
        .status(200)
        .json({
          message: "Post updated successfully",
          data: {
            ...updatedPost._doc,
            comments: updatedPost.comments.reverse(),
          },
        });
    } else {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// add reply
export const addReply = expressAsyncHandler(
  async (req: any, res): Promise<void> => {
    const { postId, commentId } = req.params;
    const { userId, reply } = req.body;

    try {
      const post = await Post.findOne({ _id: postId });

      if (post) {
        const commentIndex = post.comments.findIndex(
          (c: any) => c?._id.toString() === commentId
        );
        if (commentIndex !== -1) {
          const newReply = {
            userId,
            comment: reply,
          };
          post.comments[commentIndex].replies.push(newReply);

          const activity = new Activity({
            type: "reply",
            by: userId,
            userId: post.comments[commentIndex].userId,
          });

          activity.save();

          await post.save();

          await post.populate({
            path: "creator",
            model: "User",
          });
          await post.populate({
            path: "comments.userId",
            model: "User",
          });
          await post.populate({
            path: "comments.replies.userId",
            model: "User",
          });

          res.status(201).json({
            message: "Reply added successfully",
            data: post.comments.reverse(),
          });
        } else {
          res.status(404).json({ message: "Comment not found" });
        }
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// delete reply
export const deleteReply = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { postId, commentId, replyId } = req.params;

    try {
      const post = await Post.findById(postId).populate({
        path: "creator",
        model: "User",
      });

      if (!post) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      const comment = post.comments.find(
        (comment: any) => String(comment._id) === commentId
      );

      if (!comment) {
        res.status(404).json({ message: "Comment not found" });
        return;
      }

      const replyIndex = comment.replies.findIndex(
        (reply: any) => String(reply._id) === replyId
      );

      if (replyIndex === -1) {
        res.status(404).json({ message: "Reply not found" });
        return;
      }

      comment.replies.splice(replyIndex, 1);

      await post.save();

      await post.populate({
        path: "comments.userId",
        model: "User",
      });
      await post.populate({
        path: "comments.replies.userId",
        model: "User",
      });

      res.status(200).json({
        message: "Reply deleted successfully",
        data: post.comments.reverse(),
      });
    } catch (error) {
      console.error("Error deleting reply:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
