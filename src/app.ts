// Imports
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import routes from "./app/routes";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import config from "./config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

// Express App
export const app: Application = express();

// Using cors
app.use(
  cors({
    origin:
      config.env === "development"
        ? config.development_frontend_url
        : config.production_frontend_url,
    credentials: true,
  })
);

// Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// App using the routes
app.use("/api/v1", routes);

// Global Error Handler
app.use(globalErrorHandler);

// Handle NOT FOUND Route
app.use((req: Request, res: Response, next: NextFunction) => {
  // Check if the requested path is /graphql
  if (req.originalUrl === "/graphql") {
    // If it is /graphql, pass the control to the next middleware (Apollo Server)
    return next();
  }

  // If it's not /graphql, treat it as Not Found
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found.",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Route doesn't exist.",
      },
    ],
  });
});

export default app;
