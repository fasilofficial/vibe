import mongoose, { Document, Schema } from "mongoose";

interface IReport extends Document {
  postId: string;
  resolved: boolean;
  reports: [
    {
      description: string;
      userId: string;
    }
  ];
}

const reportSchema = new Schema(
  {
    postId: { type: String },
    resolved: { type: Boolean, default: false },
    reports: [
      {
        description: { type: String },
        userId: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>("Report", reportSchema);

export default Report;
