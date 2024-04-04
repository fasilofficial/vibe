import express from "express";

import {
  authAdmin,
  logoutAdmin,
  registerAdmin,
} from "../controllers/adminController";

const router = express.Router();

// register
router.post("/", registerAdmin);

// login
router.post("/auth", authAdmin);

// logout
router.post("/logout", logoutAdmin);

export default router;
