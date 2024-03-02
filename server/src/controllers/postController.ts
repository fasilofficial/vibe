import expressAsyncHandler from "express-async-handler";
import Post from "../models/Post";
import Activity from "../models/Activity";

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

    res.status(201).json(createdPost);
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
      .sort({ createdAt: -1 });

    if (posts.length > 0) {
      res.status(200).json(posts);
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
  async (req: any, res): Promise<void> => {
    const { userId, comment }: { userId: string; comment: string } = req.body;

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (post) {
      post.comments.push({ userId, comment });

      if (userId !== post.creator) {
        const activity = new Activity({
          type: "comment",
          by: userId,
          userId: post.creator,
        });
        await activity.save();
      }

      await post.save();
    } else {
      res.status(404);
      throw new Error("Post not found");
    }
  }
);

// like post
export const likePost = expressAsyncHandler(
  async (req: any, res): Promise<void> => {
    const { userId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (post) {
      const userIdIndex = post.likes.indexOf(userId);

      if (userIdIndex !== -1) {
        // User has already liked the post
        post.likes.splice(userIdIndex, 1); // Remove the like
      } else {
        post.likes.push(userId); // Add the like

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

      res.status(200).send("Post like toggled!"); // Send a success response
    } else {
      res.status(404).send("Post not found");
    }
  }
);

// delete comment
export const deleteComment = expressAsyncHandler(async (req: any, res: any) => {
  const { postId, commentId } = req.params;
  const post = await Post.findById(postId);

  if (post) {
    const commentIndex = post.comments.findIndex((comment: any) => {
      return String(comment._id) === commentId;
    });

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    post.comments.splice(commentIndex, 1);

    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } else {
    res.status(404).send("Post not found");
  }
});

// delete post
export const deletePost = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { postId } = req.params;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// get post
export const getPost = expressAsyncHandler(async (req: any, res: any) => {
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// edit post
export const editPost = expressAsyncHandler(async (req: any, res: any) => {
  const { id: postId } = req.params;

  console.log(req.body);

  try {
    const updatedPost = await Post.findByIdAndUpdate(postId, req.body.newPost, {
      new: true,
    });

    if (updatedPost) {
      return res
        .status(200)
        .json({ message: "Post updated successfully", post: updatedPost });
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
    //     const {
    //       userId,
    //       comment,
    //       commentId,
    //     }: { userId: string; comment: string; commentId: string } = req.body;
    //     const { postId } = req.params;
    //     try {
    //       const post = await Post.findOne({ _id: postId });
    //       if (post) {
    //         const commentIndex = post.comments.findIndex(
    //           (c) => c._id.toString() === commentId
    //         );
    //         if (commentIndex !== -1) {
    //           post.comments[commentIndex].replies.push({ userId, comment });
    //           await post.save();
    //           res.status(201).json({ message: "Reply added successfully" });
    //         } else {
    //           res.status(404).json({ message: "Comment not found" });
    //         }
    //       } else {
    //         res.status(404).json({ message: "Post not found" });
    //       }
    //     } catch (error) {
    //       console.error("Error adding reply:", error);
    //       res.status(500).json({ message: "Internal server error" });
    //     }
  }
);
