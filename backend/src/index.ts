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

// Add these global error handlers at the top
process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.error(error.name, error.message);
    process.exit(1);
});
console.log("Starting application...");

const app = express();
console.log("Express app created.");

LLMConfigService.initialize(); // Initialize LLM configurations

const PORT = parseInt(process.env.PORT || "3000", 10);
app.set("trust proxy", true); // Trust first proxy for rate limiting
// Rate limiting

console.log("App configured.");
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
    }),
);
app.use(
    cors({
        origin: process.env.ALLOWED_ORIGINS?.split(",") || [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:3000",
        ],
        credentials: true,
    }),
);
app.use(
    compression({
        filter: (req, res) => {
            if (req.headers["x-no-compression"]) {
                return false;
            }
            if (res.getHeader("Content-Type") === "text/event-stream") {
                return false;
            }
            return compression.filter(req, res);
        },
    }),
);
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Test stream route
app.get("/test-stream", async (req, res) => {
    console.log("Test stream connected");
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    for (let i = 0; i < 5; i++) {
        res.write(`data: ${JSON.stringify({ content: `Chunk ${i} ` })}\n\n`);
        if ((res as any).flush) (res as any).flush();
        await new Promise((resolve) => setTimeout(resolve, 500));
    }
    res.write("data: [DONE]\n\n");
    res.end();
});

app.use("/api", authRoutes);
app.use("/api", threadRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown for Railway
process.on("SIGTERM", () => {
    console.log("SIGTERM received, shutting down gracefully");
    process.exit(0);
});

process.on("SIGINT", () => {
    console.log("SIGINT received, shutting down gracefully");
    process.exit(0);
});

const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 Listening on 0.0.0.0:${PORT}`);
});

process.on("unhandledRejection", (reason: Error | any) => {
    console.error("UNHANDLED REJECTION! 💥 Shutting down...");
    console.error(reason.name, reason.message);
    server.close(() => {
        process.exit(1);
    });
});
// Also log memory usage periodically to check for leaks
setInterval(() => {
    console.log(
        `💡 Current memory usage: ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
    );
}, 60000); // Log every minute
