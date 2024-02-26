import expressAsyncHandler from "express-async-handler";
import Admin from "../models/Admin";
import generateToken from "../utils/generateToken";
import User from "../models/User";
import Post from "../models/Post";
import Report from "../models/Report";

// Register
export const registerAdmin = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { name, email, password, profileUrl } = req.body;

    if (!name || !email || !password || !profileUrl) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      res.status(400);
      throw new Error("User already exist");
    }
    const admin = await Admin.create({
      name,
      email,
      password,
      profileUrl,
    });

    if (admin) {
      generateToken(res, admin._id, true);

      res.status(201).json(admin);
    } else {
      res.status(400);
      throw new Error("Invalid admin data");
    }
  }
);

// Login
export const authAdmin = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { email, password } = req.body;
    if (email.length === 0 && password.length === 0) {
      throw new Error("Please enter email and password");
    }
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPasswords(password))) {
      generateToken(res, admin._id, true);

      res.status(201).json(admin);
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
);

// Logout
export const logoutAdmin = expressAsyncHandler(
  async (req, res): Promise<void> => {
    res.cookie("adminJwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Admin logged out" });
  }
);

// Get users
export const getUsers = expressAsyncHandler(async (req, res): Promise<void> => {
  const users = await User.find({}).select("-password");
  res.status(200).json(users);
});

// Get posts
export const getPosts = expressAsyncHandler(async (req, res): Promise<void> => {
  const posts = await Post.find({}).populate({
    path: "creator",
    model: "User",
  });

  res.status(200).json(posts);
});

// Get users
export const getUser = expressAsyncHandler(async (req, res): Promise<void> => {
  const { credential } = req.params;

  if (credential) {
    if (credential.includes("@")) {
      let user = await User.findOne({ email: credential });
      if (user) res.status(200).json(user);
      else {
        res.status(404);
        throw new Error("User not found");
      }
    } else {
      let user = await User.findOne({ username: credential });
      if (user) res.status(200).json(user);
      else {
        res.status(404);
        throw new Error("User not found");
      }
    }
  }
});

// Get user by username
export const addUser = expressAsyncHandler(async (req, res): Promise<void> => {
  let username;

  if (!req.body.username)
    username =
      req.body.firstName.toLowerCase() + Math.floor(Math.random() * 100);

  const user = new User({ ...req.body, username });
  await user.save();
  res.status(200).json(user);
});

// Block/Unblock user

export const addPost = expressAsyncHandler(async (req, res): Promise<void> => {
  const newPost = { ...req.body };

  const createdPost = new Post(newPost);
  createdPost.save();

  res.status(200).json(createdPost);
});

export const addReport = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { reportDescription: description, postId, userId } = req.body;

    const report = new Report({ description, userId, postId });
    await report.save();

    res.status(201).json({ message: "Report added successfully", report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
