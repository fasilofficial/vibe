import expressAsyncHandler from "express-async-handler";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import Post from "../models/Post";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";

// register
export const registerUser = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { name, username, email, password, dob, profileUrl } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      res.status(400);
      throw new Error("User already exist");
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      throw new Error("Username already exist");
    }

    const user = await User.create({
      name,
      email,
      username,
      password,
      dob,
      profileUrl,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json(user);
    } else {
      res.status(400).json({ error: { message: "Invalid user data" } });
    }
  }
);

// login
export const authUser = expressAsyncHandler(
  async (req: any, res: any): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPasswords(password))) {
      if (!user.blocked) {
        generateToken(res, user._id);

        req.session.user = user;

        res.status(201).json(user);
      } else {
        // res.status(400).json({ error: "You're blocked by the admin" });
        throw new Error("You're blocked by the admin");
      }
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
);

// logout
export const logoutUser = expressAsyncHandler(
  async (req, res): Promise<void> => {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "User logged out" });
  }
);

// user posts
export const getUserPosts = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ creator: userId });

    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "No posts found for the user" });
    }
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get users
export const getUsers = expressAsyncHandler(async (req, res) => {
  try {
    const { email } = req.query;

    let users;

    if (email) users = await User.findOne({ email });
    else users = await User.find({});

    if (users) {
      res.status(200).json(users);
    } else {
      throw new Error("Users not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get user
export const getUser = expressAsyncHandler(async (req, res) => {
  try {
    const userInfo = await User.findById(req.params.id);

    if (!userInfo) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// block/unblock user
export const blockUser = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blocked = !user.blocked;

    await user.save();

    res.status(200).json({
      message: "User block toggled successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// send otp
export const sendOtp = expressAsyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const mailOptions = {
    from: "mfasilofficial@gmail.com",
    to: email,
    subject: "OTP from VIBE",
    text: `Your OTP is ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      res
        .status(200)
        .json({ message: `OTP sent to ${email} successfully`, otp: OTP });
    }
  });
});

// forgot password
export const handleForgotPassword = expressAsyncHandler(
  async (req: any, res: any) => {
    const { email, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error updating password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);