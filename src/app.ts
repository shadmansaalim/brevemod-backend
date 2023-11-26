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
    origin: function (origin, callback) {
      const allowedOrigins = [
        config.production_frontend_url,
        config.development_frontend_url,
        config.graphql_sandbox_development_url,
      ];

      if (
        config.env === "development" &&
        (!origin || allowedOrigins.includes(origin))
      ) {
        callback(null, true);
      } else if (
        config.env !== "development" &&
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
