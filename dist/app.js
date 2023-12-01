"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Imports
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const http_status_1 = __importDefault(require("http-status"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
// Express App
exports.app = (0, express_1.default)();
// Using cors
exports.app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        const allowedOrigins = [
            config_1.default.production_frontend_url,
            config_1.default.development_frontend_url,
            config_1.default.graphql_sandbox_development_url,
        ];
        if (config_1.default.env === "development" &&
            (!origin || allowedOrigins.includes(origin))) {
            callback(null, true);
        }
        else if (config_1.default.env !== "development" &&
            allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
// Parser
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
// App using the routes
exports.app.use("/api/v1", routes_1.default);
// Global Error Handler
exports.app.use(globalErrorHandler_1.default);
// Handle NOT FOUND Route
exports.app.use((req, res, next) => {
    // Check if the requested path is /graphql
    if (req.originalUrl === "/graphql") {
        // If it is /graphql, pass the control to the next middleware (Apollo Server)
        return next();
    }
    // If it's not /graphql, treat it as Not Found
    res.status(http_status_1.default.NOT_FOUND).json({
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
exports.default = exports.app;
