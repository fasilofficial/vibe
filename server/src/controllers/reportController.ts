import expressAsyncHandler from "express-async-handler";
import Report from "../models/Report";
import { Request, Response } from "express";
import Post from "../models/Post";

// get reports
export const getReports = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const reports = await Report.find()
        .populate({
          path: "postId",
          model: "Post",
        })
        .populate({
          path: "reports.userId",
          model: "User",
        });

      if (reports.length > 0) {
        res.status(200).json({ reports });
      } else {
        res.status(404).json({ message: "No reports found" });
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// get report
export const getReport = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const report = await Report.findById(reportId)
      .populate({
        path: "postId",
        model: "Post",
      })
      .populate({
        path: "reports.userId",
        model: "Post",
      });

    if (report) {
      res.status(200).json(report);
    } else {
      throw new Error("Report not found");
    }
  }
);

// resolve report
export const resolveReport = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { reportId } = req.params;
    const { postId } = req.body;

    try {
      const post = await Post.findById(postId);

      if (!post) {
        res.status(404);
        throw new Error("Post not found");
      }

      const reports = await Report.findOne({ postId });

      if (!reports) {
        res.status(404);
        throw new Error("No reports found for this post");
      }

      if (reports.reports.length >= 5) {
        await post.deleteOne();

        reports.resolved = true;

        await reports.save();
        await reports.populate({
          path: "postId",
          model: "Post",
        });
        await reports.populate({
          path: "reports.userId",
          model: "User",
        });

        res.status(200).json({
          message: "Post deleted due to excessive reports",
          data: reports,
        });
      } else {
        res
          .status(200)
          .json({ message: "Post not deleted because of few reports." });
      }
    } catch (error) {
      console.error("Error resolving report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// add report
export const addReport = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { postId, description, userId } = req.body;
      let existingReport = await Report.findOne({ postId });

      if (existingReport) {
        const existingUserReport = existingReport.reports.find(
          (report) => report.userId === userId
        );

        if (existingUserReport) {
          res
            .status(409)
            .json({ message: "You have already reported this post" });
          return;
        }

        existingReport.reports.push({ description, userId });
        await existingReport.save();

        res.status(200).json({
          message: "New report added",
          report: existingReport,
        });
      } else {
        const newReport = new Report({
          postId,
          reports: [{ description, userId }],
        });

        const savedReport = await newReport.save();

        res
          .status(201)
          .json({ message: "New report created", report: savedReport });
      }
    } catch (error) {
      console.error("Error adding report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
