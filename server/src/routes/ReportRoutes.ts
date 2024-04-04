import express from "express";

import {
  getReport,
  getReports,
  resolveReport,
  addReport,
} from "../controllers/reportController";
import { protectAdmin } from "../middleware/authMiddleware";


const router = express.Router();

// get reports
router.get("/", getReports);

// get report
router.get("/:reportId", getReport);

// resolve report
router.put("/:reportId", protectAdmin, resolveReport);

// add report
router.post("/", addReport);

export default router;
