import express from "express";
import cors from "cors";
import helmet, { crossOriginEmbedderPolicy } from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import { errorHandler } from "@/middleware/errorHandler";
import { notFound } from "@/middleware/notFound";
import authRoutes from "./routes/auth.routes";
import { LLMConfigService } from "./services/llm/llm.config";
import threadRoutes from "./routes/thread.routes";

dotenv.config();

const app = express();

LLMConfigService.initialize(); // Initialize LLM configurations

const PORT = parseInt(process.env.PORT || "3000", 10);
app.set("trust proxy", true); // Trust first proxy for rate limiting
// Rate limiting
const EXCLUDED_IPS = ["123.123.123.123", "127.0.0.1"]; // Add any IPs you want to exclude

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => req.ip || req.socket.remoteAddress || "unknown",
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
    skip: (req, res) => {
        // Exclude specific IPs from rate limiting
        const ip = req.ip || req.socket.remoteAddress;
        return ip ? EXCLUDED_IPS.includes(ip) : false;
    },
});

// Middleware
app.use(
    helmet({
        crossOriginEmbedderPolicy: false, // Disable for Railway compatibility
    })
);
app.use(
    cors({
        // origin: "*",
        origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
        credentials: true,
    })
);
app.use(compression());
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api", authRoutes);
app.use("/api", threadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// // Graceful shutdown for Railway
// process.on("SIGTERM", () => {
//     console.log("SIGTERM received, shutting down gracefully");
//     process.exit(0);
// });

// process.on("SIGINT", () => {
//     console.log("SIGINT received, shutting down gracefully");
//     process.exit(0);
// });

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Listening on 0.0.0.0:${PORT}`);
});
