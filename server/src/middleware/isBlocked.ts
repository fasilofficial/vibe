import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET as string;

const isBlocked = asyncHandler(async (req: any, res: any, next) => {
  // let token = req.cookies.jwt;

  // if (!token) {
  //   return res.status(401).json({ message: "Not authorized, no token" });
  // }

  // try {
  //   const decoded: any = jwt.verify(token, JWT_SECRET);
  //   const user = await User.findById(decoded.userId).select("-password");

  //   if (user) {
  //     req.user = user;

  //     if (!user.blocked) {
  //       next();
  //     } else {
  //       res.status(401);
  //       throw new Error("Not authorized, blocked by admin");
  //     }
  //   } else {
  //     res.status(404);
  //     throw new Error("User not found");
  //   }
  // } catch (error) {
  //   res.status(401);
  //   throw new Error("Not authorized, invalid token");
  // }

  next(); // dummy
});

export { isBlocked };
