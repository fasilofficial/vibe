import mongoose, { Document, Schema } from "mongoose";

interface IActivity extends Document {
  type: "like" | "comment" | "follow";
  userId: string;
  by: string;
  viewed: boolean;
  // postId: string;
}

const activitySchema = new Schema(
  {
    type: { type: String },
    userId: { type: String },
    by: { type: String },
    viewed: { type: Boolean, default: false },
    // postId: { type: String },
  },
  { timestamps: true }
);

const Activity = mongoose.model<IActivity>("Activity", activitySchema);

export default Activity;
