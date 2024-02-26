import express from "express";

import {
  getReport,
  getReports,
  resolveReport,
  addReport,
} from "../controllers/reportController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// get reports
router.get("/", getReports);

// get report
router.get("/:reportId", getReport);

// get report
router.put("/:reportId", resolveReport);

// add report
router.post("/", addReport);

export default router;
