import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../types";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(HttpStatusCode.NotFound);
  next(error);
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (res.headersSent) {
    return next(err);
  }
  let statusCode =
    res.statusCode === HttpStatusCode.OK
      ? HttpStatusCode.InternalServerError
      : res.statusCode;
  let message = err.message;

  if (err.name === "CastError") {
    statusCode = HttpStatusCode.NotFound;
    message = "Resource not found";
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
