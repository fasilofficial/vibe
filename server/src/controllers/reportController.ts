import expressAsyncHandler from "express-async-handler";
import Report from "../models/Report";
import { Request, Response } from "express";
import Post from "../models/Post";
import Activity from "../models/Activity";

// get reports
export const getReports = expressAsyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    try {
      const reports = await Report.find()
        .populate({
          path: "postId",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        })
        .populate({
          path: "reports.userId",
          model: "User",
        });

      if (reports.length > 0) {
        res.status(200).json({ message: "reports", data: reports });
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
        populate: {
          path: "creator",
          model: "User",
        },
      })
      .populate({
        path: "reports.userId",
        model: "User",
      });

    if (report) {
      res.status(200).json({ message: "report", data: report });
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

      const report = await Report.findOne({ postId });

      if (!report) {
        res.status(404);
        throw new Error("No report found for this post");
      }

      if (report.reports.length >= 5) {
        const activity = new Activity({
          type: "report",
          by: post.creator, // dummy
          userId: post.creator,
        });

        activity.save();

        await post.deleteOne();

        report.resolved = true;

        await report.save();
        await report.populate({
          path: "postId",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });
        await report.populate({
          path: "reports.userId",
          model: "User",
        });

        res.status(200).json({
          message: "Post deleted due to excessive reports",
          data: report,
        });
      } else {
        report.resolved = true;

        await report.save();
        await report.populate({
          path: "postId",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });
        await report.populate({
          path: "reports.userId",
          model: "User",
        });

        res
          .status(200)
          .json({ message: "Report marked as resolved.", data: report });
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
        await existingReport.populate({
          path: "postId",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });
        await existingReport.populate({
          path: "reports.userId",
          model: "User",
        });

        res.status(200).json({
          message: "New report added",
          data: { updatedReport: existingReport },
        });
      } else {
        const newReport = new Report({
          postId,
          reports: [{ description, userId }],
        });

        await newReport.save();
        await newReport.populate({
          path: "postId",
          model: "Post",
          populate: {
            path: "creator",
            model: "User",
          },
        });
        await newReport.populate({
          path: "reports.userId",
          model: "User",
        });

        res
          .status(201)
          .json({ message: "New report created", data: { newReport } });
      }
    } catch (error) {
      console.error("Error adding report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
