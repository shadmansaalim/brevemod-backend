// Imports
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";

// Application Routes
import routes from "./app/routes";
import httpStatus from "http-status";
import cookieParser from "cookie-parser";
import config from "./config";

// Express App
const app: Application = express();

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
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Not Found.",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Route doesn't exists.",
      },
    ],
  });

  next();
});

export default app;
