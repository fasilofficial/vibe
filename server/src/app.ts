import express, { Express, Request, Response } from "express";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { connectDatabase } from "./config/database";

import userRouter from "./routes/UserRoutes";
import adminRouter from "./routes/AdminRoutes";
import postRouter from "./routes/PostRoutes";
import reportRouter from "./routes/ReportRoutes";

import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { protect } from "./middleware/authMiddleware";

const app = express();
const port = process.env.PORT || 3300;

app.use(morgan("dev"));

app.use(
  session({
    secret: "your-secret-key", // Change this to a secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Adjust cookie options as needed
  })
);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("welcome to VIBE.");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/reports", reportRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
