import jwt from "jsonwebtoken";
import { Response } from "express";

const secretKey = process.env.JWT_SECRET || "secret";

const generateToken = (res: any, userId: string, isAdmin = false) => {
  if (isAdmin) {
    const adminToken = jwt.sign({ userId }, secretKey, {
      expiresIn: "30d",
    });

    res.cookie("adminJwt", adminToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  } else {
    const token = jwt.sign({ userId }, secretKey, {
      expiresIn: "30d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
};

export default generateToken;
