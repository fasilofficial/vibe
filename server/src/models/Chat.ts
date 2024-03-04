import mongoose, { Document, Schema } from "mongoose";

interface IChat extends Document {
  sender: string;
  receiver: string;
  message: string;
}

const chatSchema = new Schema(
  {
    sender: { type: String },
    receiver: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
