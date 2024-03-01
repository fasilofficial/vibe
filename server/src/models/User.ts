import mongoose, { Document, Schema } from "mongoose";

import bcrypt from "bcrypt";

interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  profileUrl: string;
  password: string;
  blocked: boolean;
  dob: Date;
  followings: {
    _id: string;
  }[];
  followers: {
    _id: string;
  }[];
  matchPasswords(enteredPassword: string): Promise<boolean>;
}

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    profileUrl: { type: String },
    password: { type: String },
    dob: { type: Date },
    blocked: { type: Boolean, required: true, default: false },
    followings: { type: [], default: [] },
    followers: { type: [], default: [] },
  },
  { timestamps: true }
);

userSchema.pre(
  "save",
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);

    if (this?.password) {
      this.password = await bcrypt.hash(this?.password, salt);
    }
  }
);

userSchema.methods.matchPasswords = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
