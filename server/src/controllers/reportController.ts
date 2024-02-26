import expressAsyncHandler from "express-async-handler";
import Report from "../models/Report";

export const getReports = expressAsyncHandler(async (req: any, res: any) => {
  const reports = await Report.find({}).populate({
    path: "postId",
    model: "Post",
  });

  if (reports) {
    res.status(200).json(reports);
  } else {
    throw new Error("Reports not found");
  }
});

export const getReport = expressAsyncHandler(async (req: any, res: any) => {
  const { reportId } = req.params;
  const report = await Report.findById(reportId).populate({
    path: "postId",
    model: "Post",
  });

  if (report) {
    res.status(200).json(report);
  } else {
    throw new Error("Report not found");
  }
});

export const resolveReport = expressAsyncHandler(async (req: any, res: any) => {
  const { reportId } = req.params;

  try {
    const resolvedReport = await Report.findByIdAndUpdate(reportId, {
      $set: { resolved: true },
    }).populate({ path: "postId", model: "Post" });

    if (!resolvedReport) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.status(200).json({
      message: "Report resolved successfully",
      report: resolvedReport,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const addReport = expressAsyncHandler(async (req: any, res: any) => {
  try {
    const { reportDescription: description, postId, userId } = req.body;

    const report = new Report({ description, userId, postId });
    await report.save();

    res.status(201).json({ message: "Report added successfully", report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
