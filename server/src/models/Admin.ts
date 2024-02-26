import mongoose, { Document, Schema } from "mongoose";

import bcrypt from "bcrypt";

interface IAdmin extends Document {
  name: string;
  email: string;
  profileUrl: string;
  password: string;
  matchPasswords(enteredPassword: string): Promise<boolean>;
}

const adminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileUrl: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

adminSchema.pre(
  "save",
  async function (next: mongoose.CallbackWithoutResultAndOptionalError) {
    if (!this.isModified("password")) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
);

adminSchema.methods.matchPasswords = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
