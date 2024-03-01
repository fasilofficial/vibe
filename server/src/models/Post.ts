import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
  caption: string;
  location: string;
  tags: string[];
  imageUrl: string;
  creator: string;
  likes: string[];
  comments: [
    {
      userId: string;
      comment: string;
      replies?: [
        {
          userId: string;
          comment: string;
        }
      ];
    }
  ];
}

const replySchema = new Schema(
  {
    userId: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const commentSchema = new Schema(
  {
    userId: String,
    comment: String,
    replies: [replySchema],
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    caption: { type: String },
    location: { type: String },
    tags: [{ type: String }],
    imageUrl: { type: String },
    creator: { type: String },
    likes: [{ type: String }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
