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
    }
  ];
}

const postSchema = new Schema(
  {
    caption: { type: String },
    location: { type: String },
    tags: [{ type: String }],
    imageUrl: { type: String },
    creator: { type: String },
    likes: [{ type: String }],
    comments: [{ userId: String, comment: String }],
  },
  { timestamps: true }
);

const Post = mongoose.model<IPost>("Post", postSchema);

export default Post;
