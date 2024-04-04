import expressAsyncHandler from "express-async-handler";
import User from "../models/User";
import generateToken from "../utils/generateToken";
import Post from "../models/Post";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import Activity from "../models/Activity";
import { Request, Response } from "express";
import cron from "node-cron";

// cron job to update expired blueticks
cron.schedule("0 0 * * *", async () => {
  try {
    const currentDate = new Date();

    const expiredUsers = await User.find({
      "bluetick.status": true,
      "bluetick.expiryDate": { $lte: currentDate },
    });

    for (const user of expiredUsers) {
      user.bluetick.status = false;

      user.set({
        "bluetick.expiryDate": undefined,
        "bluetick.type": undefined,
      });

      await user.save();
    }

    console.log("Expired blueticks updated successfully");
  } catch (error) {
    console.error("Error updating expired blueticks:", error);
  }
});

// register
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
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
      const token = generateToken(user._id);

      res.cookie("adminJwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json(user);
    } else {
      res.status(400).json({ error: { message: "Invalid user data" } });
    }
  }
);

// login
export const authUser = expressAsyncHandler(
  async (req: any, res): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("All fields are required");
    }

    const user = await User.findOne({ email })
      .populate({
        path: "followers._id",
        model: "User",
      })
      .populate({
        path: "followings._id",
        model: "User",
      })
      .populate({
        path: "saves._id",
        model: "Post",
        populate: {
          path: "creator",
          model: "User",
        },
      });

    if (user && (await user.matchPasswords(password))) {
      if (!user.blocked) {
        const token = generateToken(user._id);

        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          sameSite: "strict",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        const posts = await Post.find({})
          .populate({
            path: "creator",
            model: "User",
          })
          .populate({
            path: "comments.userId",
            model: "User",
          })
          .populate({
            path: "comments.replies.userId",
            model: "User",
          })
          .sort({ createdAt: -1 });

        const users = await User.find({})
          .populate({
            path: "followers._id",
            model: "User",
          })
          .populate({
            path: "followings._id",
            model: "User",
          })
          .populate({
            path: "saves._id",
            model: "Post",
            populate: {
              path: "creator",
              model: "User",
            },
          });

        res
          .status(201)
          .json({ message: "Login successful", user, posts, users });
      } else {
        res.status(400);
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
  async (req: Request, res: Response): Promise<void> => {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "User logged out" });
  }
);

// user posts
export const getUserPosts = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const posts = await Post.find({ creator: userId })
        .populate({
          path: "creator",
          model: "User",
        })
        .populate({
          path: "comments.userId",
          model: "User",
        })
        .populate({
          path: "comments.replies.userId",
          model: "User",
        });

      if (posts.length > 0) {
        res.status(200).json({ data: posts });
      } else {
        res.status(404).json({ message: "No posts found for the user" });
      }
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// get users
export const getUsers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { email, searchTerm }: { email?: string; searchTerm?: string } =
        req.query;

      let users;

      if (email) users = await User.findOne({ email });
      else if (searchTerm) {
        const escapedSearchTerm = searchTerm.replace(
          /[-\/\\^$*+?.()|[\]{}]/g,
          "\\$&"
        );

        const regexPattern = new RegExp(escapedSearchTerm, "i");

        users = await User.find({
          $or: [
            { username: { $regex: regexPattern } },
            { email: { $regex: regexPattern } },
            { name: { $regex: regexPattern } },
          ],
        })
          .populate({
            path: "followers._id",
            model: "User",
          })
          .populate({
            path: "followings._id",
            model: "User",
          })
          .populate({
            path: "saves._id",
            model: "Post",
            populate: {
              path: "creator",
              model: "User",
            },
          });
      } else {
        users = await User.find({})
          .populate({
            path: "followers._id",
            model: "User",
          })
          .populate({
            path: "followings._id",
            model: "User",
          })
          .populate({
            path: "saves._id",
            model: "Post",
            populate: {
              path: "creator",
              model: "User",
            },
          });
      }

      if (users) {
        res.status(200).json({ data: users });
      } else {
        throw new Error("Users not found");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// get user
export const getUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById(req.params.id)
        .populate({
          path: "followers._id",
          model: "User",
        })
        .populate({
          path: "followings._id",
          model: "User",
        })
        .populate({
          path: "saves._id",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// block/unblock user
export const blockUser = expressAsyncHandler(async (req: Request, res: any) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate({
        path: "followers._id",
        model: "User",
      })
      .populate({
        path: "followings._id",
        model: "User",
      })
      .populate({
        path: "saves._id",
        model: "Post",
        populate: {
          path: "creator",
          model: "User",
        },
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.blocked = !user.blocked;

    await user.save();

    res.status(200).json({
      message: "User block toggled successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// send otp
export const sendOtp = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { email, forgotPassword } = req.body;

    const user = await User.findOne({ email });

    if (forgotPassword && !user) {
      res.status(404);
      throw new Error("User doesn't exist");
    }

    if (!forgotPassword && user) {
      res.status(401);
      throw new Error("User already exist");
    }

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
  }
);

// forgot password
export const handleForgotPassword = expressAsyncHandler(
  async (req: Request, res: any) => {
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

// change password
export const handleChangePassword = expressAsyncHandler(
  async (req: any, res: any) => {
    const { currentPassword, newPassword, userId } = req.body;

    try {
      if (!currentPassword || !newPassword || !userId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await user.matchPasswords(currentPassword);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error while changing password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// follow
export const followUser = expressAsyncHandler(
  async (req: Request, res: any) => {
    const { followingId, acceptRequest } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user || !following) {
      return res.status(401).send({ message: "Bad request" });
    }

    // Check if the user is already following the target user
    const isFollowing = user.followings.some(
      (following) => following._id === followingId
    );

    if (!isFollowing) {
      if (following.private && !acceptRequest) {
        const activity = new Activity({
          type: "follow_request",
          by: userId,
          userId: following._id,
        });

        await activity.save();

        return res.json({ message: "Follow request sent" });
      }

      // Follow the user
      user.followings.push({ _id: followingId });
      following.followers.push({ _id: userId });

      if (!acceptRequest) {
        const activity = new Activity({
          type: "follow",
          by: userId,
          userId: following._id,
        });

        await activity.save();
      }

      await user.save();
      await following.save();

      await user.populate({ path: "followings._id", model: "User" });
      await following.populate({ path: "followers._id", model: "User" });

      return res.status(200).send({
        message: "User followed successfully",
        data: { followings: user.followings, followers: following.followers },
      });
    }

    return res.status(400).send({ message: "User is already being followed" });
  }
);

// unfollow
export const unfollowUser = expressAsyncHandler(
  async (req: Request, res: any) => {
    const { followingId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    const following = await User.findById(followingId);

    if (!user || !following) {
      return res.status(401).send({ message: "Bad request" });
    }

    // Check if the user is following the target user
    const isFollowing = user.followings.some(
      (following) => following._id === followingId
    );

    if (isFollowing) {
      // Unfollow the user
      user.followings = user.followings.filter(
        (following) => following._id !== followingId
      );
      following.followers = following.followers.filter(
        (follower) => follower._id !== userId
      );

      await user.save();
      await following.save();

      await user.populate({ path: "followings._id", model: "User" });
      await following.populate({ path: "followers._id", model: "User" });

      return res.status(200).send({
        message: "User unfollowed successfully",
        data: { followings: user.followings, followers: following.followers },
      });
    }

    return res.status(400).send({ message: "User is not being followed" });
  }
);

// remove follower
export const removeFollower = expressAsyncHandler(
  async (req: Request, res: any) => {
    const { followerId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(401).send({ message: "Bad request" });
    }

    // Check if the user is following the target user
    const isFollowing = follower.followings.some(
      (following) => following._id === userId
    );

    if (isFollowing) {
      // remove the follower
      user.followers = user.followers.filter(
        (follower) => follower._id !== followerId
      );

      follower.followings = follower.followings.filter(
        (following) => following._id !== userId
      );

      await user.save();
      await follower.save();

      await user.populate({ path: "followers._id", model: "User" });
      await follower.populate({ path: "followings._id", model: "User" });

      return res.status(200).send({
        message: "Followers removed successfully",
        data: { followers: user.followers, followings: follower.followings },
      });
    }

    return res.status(400).send({ message: "User is not being followed" });
  }
);

// get followings
export const getFollowings = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "followings._id",
      model: "User",
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user.followings);
  }
);

// get followers
export const getFollowers = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const user = await User.findById(userId).populate({
      path: "followers._id",
      model: "User",
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user.followers);
  }
);

// get suggestions
export const getSuggestions = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const suggestions = await User.find({});

    res.status(200).json();
  }
);

// get activities
export const getActivities = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
      const activities = await Activity.find({ userId })
        .populate({
          path: "by",
          model: "User",
        })
        .sort({ createdAt: -1 });

      if (activities.length > 0) {
        res.status(200).json(activities);
      } else {
        res.status(404).json({ message: "No activities found for the user" });
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// save post
export const savePost = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { postId } = req.body;
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const postExists: any = user.saves.find(
      (save) => String(save._id) === postId
    );

    if (postExists) {
      user.saves = user.saves.filter((save) => String(save._id) !== postId);

      await user.save();

      await user.populate({
        path: "saves._id",
        model: "Post",
        populate: {
          path: "creator",
          model: "User",
        },
      });

      res
        .status(200)
        .json({ message: "Post unsaved successfully", data: user.saves });
    } else {
      user.saves.push({ _id: postId });
      await user.save();

      await user.populate({
        path: "saves._id",
        model: "Post",
        populate: {
          path: "creator",
          model: "User",
        },
      });

      res
        .status(200)
        .json({ message: "Post saved successfully", data: user.saves });
    }
  }
);

// edit user
export const editUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    const { name, username, profileUrl } = req.body;

    try {
      if (!name || !username || !profileUrl) {
        res.status(400).json({ message: "Bad request" });
        return;
      }

      const user = await User.findById(userId)
        .populate({
          path: "followers._id",
          model: "User",
        })
        .populate({
          path: "followings._id",
          model: "User",
        })
        .populate({
          path: "saves._id",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      user.name = name;
      user.username = username;
      user.profileUrl = profileUrl;

      await user.save();

      // Send a success response
      res
        .status(200)
        .json({ message: "User updated successfully", data: user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// add bluetick
export const addBluetick = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { type } = req.body;

    if (!userId || !type) {
      res.status(400);
      throw new Error("Bad Request: Missing userId or subscription type");
    }

    try {
      const user = await User.findById(userId)
        .populate({
          path: "followers._id",
          model: "User",
        })
        .populate({
          path: "followings._id",
          model: "User",
        })
        .populate({
          path: "saves._id",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      user.bluetick.status = true;
      user.bluetick.type = type;

      const expiryDate = new Date();
      if (type === "month") {
        expiryDate.setMonth(expiryDate.getMonth() + 1);
      } else if (type === "year") {
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      }

      user.bluetick.expiryDate = expiryDate;

      await user.save();

      res.status(200).json({ message: "Bluetick added", data: user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);

// toggle account type
export const toggleAccountType = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;

    if (!userId) {
      res.status(400);
      throw new Error("Bad request: Missing userId");
    }

    try {
      const user = await User.findById(userId)
        .populate({
          path: "followers._id",
          model: "User",
        })
        .populate({
          path: "followings._id",
          model: "User",
        })
        .populate({
          path: "saves._id",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });

      if (!user) {
        res.status(404);
        throw new Error("User not found");
      }

      user.private = !user.private;

      await user.save();

      res.status(200).json({ message: "Account type toggled", data: user });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error", error });
    }
  }
);
