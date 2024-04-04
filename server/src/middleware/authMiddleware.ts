import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User";
import Admin from "../models/Admin";

const JWT_SECRET = process.env.JWT_SECRET as string;

const protect = asyncHandler(async (req: any, res: any, next) => {
  // let token = req.cookies.jwt;

  // if (!token) {
  //   return res.status(401).json({ message: "Not authorized, no token" });
  // }

  // try {
  //   const decoded: any = jwt.verify(token, JWT_SECRET);
  //   console.log(decoded)
  //   req.user = await User.findById(decoded.id).select("-password");
  //   next();
  // } catch (error) {
  //   res.status(401);
  //   throw new Error("Not authorized, invalid token");
  // }

  next() // dummy
});

const protectAdmin = asyncHandler(async (req: any, res: any, next) => {
  // let token = req.cookies.adminJwt;

  // if (!token) {
  //   return res.status(401).json({ message: "Not authorized, no token" });
  // }

  // try {
  //   const decoded: any = jwt.verify(token, JWT_SECRET);
  //   console.log(decoded)
  //   req.admin = await Admin.findById(decoded.id).select("-password");
  //   next();
  // } catch (error) {
  //   res.status(401);
  //   throw new Error("Not authorized, invalid token");
  // }

  next(); // dummy
});

export { protect, protectAdmin };
