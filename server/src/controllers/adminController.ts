import expressAsyncHandler from "express-async-handler";
import Admin from "../models/Admin";
import generateToken from "../utils/generateToken";
import { HttpStatusCode } from "../types";

// Register
export const registerAdmin = expressAsyncHandler(
  async (req, res): Promise<void> => {
    const { name, email, password, profileUrl } = req.body;

    if (!name || !email || !password || !profileUrl) {
      res.status(HttpStatusCode.BadRequest);
      throw new Error("All fields are required");
    }

    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      res.status(HttpStatusCode.Conflict);
      throw new Error("User already exist");
    }
    const admin = await Admin.create({
      name,
      email,
      password,
      profileUrl,
    });

    if (admin) {
      const token = generateToken(admin._id);

      res.cookie("adminJwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.Created).json(admin);
    } else {
      res.status(HttpStatusCode.BadRequest);
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
      const token = generateToken(admin._id);

      res.cookie("adminJwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(HttpStatusCode.Created).json(admin);
    } else {
      res.status(HttpStatusCode.Unauthorized);
      throw new Error("Invalid email or password");
    }
  }
);

// Logout
export const logoutAdmin = expressAsyncHandler(
  async (req, res): Promise<void> => {
    res.cookie("adminJwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(HttpStatusCode.OK).json({ message: "Admin logged out" });
  }
);
