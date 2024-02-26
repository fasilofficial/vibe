import mongoose, { Document, Schema } from "mongoose";

interface IReport extends Document {
  description: string;
  postId: string;
  userId: string;
  resolved: boolean;
}

const reportSchema = new Schema(
  {
    description: { type: String },
    postId: { type: String },
    userId: { type: String },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
