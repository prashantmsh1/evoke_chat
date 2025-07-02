import {
    getAllThreads,
    getThreadTurnsById,
    getTurnChat,
    initiateThread,
} from "@/controller/threads.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const threadRoutes = Router();

threadRoutes.post("/thread/initiate", authMiddleware, initiateThread);

threadRoutes.get("/turn/:turnId/chat", getTurnChat);

threadRoutes.get("/thread/all", authMiddleware, getAllThreads);

threadRoutes.get("/thread/turns/:threadId", authMiddleware, getThreadTurnsById);

export default threadRoutes;
