"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Imports
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const apollo_server_express_1 = require("apollo-server-express");
const index_1 = require("./graqphql/schema/index");
const index_2 = require("./graqphql/resolvers/index");
const jwtHelper_1 = require("./helpers/jwtHelper");
// Handling Uncaught Exception Errors
process.on("uncaughtException", (error) => {
    console.log(error);
    process.exit(1);
});
// Server
let server;
// Database connection
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log(`Database connection successful`);
            // Apollo Server setup
            server = new apollo_server_express_1.ApolloServer({
                typeDefs: index_1.typeDefs,
                resolvers: index_2.resolvers,
                context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                    let user = null;
                    // Get authorization token
                    const token = req.headers.authorization;
                    if (token) {
                        // Extract user information from the Authorization header using JWT helper
                        const verifiedUser = jwtHelper_1.JwtHelpers.verifyToken(token, config_1.default.jwt.secret);
                        user = verifiedUser ? verifiedUser : null;
                    }
                    return {
                        user,
                    };
                }),
            });
            // Start Apollo Server
            yield server.start();
            // Apply middleware after server has started
            server.applyMiddleware({ app: app_1.default });
            // App listening
            app_1.default.listen(config_1.default.port, () => {
                console.log(`Server is listening on port ${config_1.default.port}`);
            });
        }
        catch (error) {
            console.log(`Failed to connect database`, error);
        }
        // Gracefully closing the server
        process.on("SIGINT", () => __awaiter(this, void 0, void 0, function* () {
            console.log("Received SIGINT. Closing server gracefully...");
            if (server) {
                // Stop Apollo Server
                yield server.stop();
                console.log("Apollo Server stopped.");
            }
            // Close MongoDB connection
            yield mongoose_1.default.connection.close();
            // Close the Express app
            process.exit(0);
        }));
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
