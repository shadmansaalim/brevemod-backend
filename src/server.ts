// Imports
import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { ApolloServer, ExpressContext, gql } from "apollo-server-express";
import { typeDefs } from "./graqphql/schema/index";
import { resolvers } from "./graqphql/resolvers/index";
import { Context } from "./interfaces/common";
import { JwtHelpers } from "./helpers/jwtHelper";
import { Secret } from "jsonwebtoken";

// Handling Uncaught Exception Errors
process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

// Server
let server: ApolloServer<ExpressContext>;

// Database connection
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log(`Database connection successful`);

    // Apollo Server setup
    server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req }): Promise<Context> => {
        let user = null;

        // Get authorization token
        const token = req.headers.authorization;

        if (token) {
          // Extract user information from the Authorization header using JWT helper
          const verifiedUser = JwtHelpers.verifyToken(
            token,
            config.jwt.secret as Secret
          );

          user = verifiedUser ? verifiedUser : null;
        }

        return {
          user,
        };
      },
    });

    // Start Apollo Server
    await server.start();

    // Apply middleware after server has started
    server.applyMiddleware({ app } as any);

    // App listening
    app.listen(config.port, () => {
      console.log(`Server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(`Failed to connect database`, error);
  }

  // Gracefully closing the server
  process.on("SIGINT", async () => {
    console.log("Received SIGINT. Closing server gracefully...");

    if (server) {
      // Stop Apollo Server
      await server.stop();
      console.log("Apollo Server stopped.");
    }

    // Close MongoDB connection
    await mongoose.connection.close();

    // Close the Express app
    process.exit(0);
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
