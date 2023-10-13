// Imports
import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { Server } from "http";

// Handling Uncaught Exception Errors
process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

// Server
let server: Server;

// Database connection
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`Database connection successful`);

    // App listening
    server = app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(`Failed to connect database`, error);
  }

  // Gracefully closing the server
  process.on("unhandledRejection", (error) => {
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}
// Calling the function
bootstrap();

// Handling signal for termination
// process.on("SIGTERM", () => {
//   console.log("SIGTERM received");
//   if (server) {
//     server.close();
//   }
// });
