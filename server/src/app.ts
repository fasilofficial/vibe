import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import userRouter from "./routes/UserRoutes";
import adminRouter from "./routes/AdminRoutes";
import postRouter from "./routes/PostRoutes";
import reportRouter from "./routes/ReportRoutes";
import chatRouter from "./routes/ChatRoutes";
import stripeRouter from "./routes/StripeRoutes";

import { errorHandler, notFound } from "./middleware/errorMiddleware";
import { HttpStatusCode } from "./types";

const app: Express = express();

app.use(morgan("dev"));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).send("welcome to VIBE.");
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/stripe", stripeRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
