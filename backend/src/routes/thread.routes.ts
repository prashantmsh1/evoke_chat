import { getTurnChat, initiateThread } from "@/controller/threads.controller";
import { authMiddleware } from "@/middleware/authMiddleware";
import { Router } from "express";

const threadRoutes = Router();

threadRoutes.post("/thread/initiate", authMiddleware, initiateThread);

threadRoutes.get("/turn/:turnId/chat", getTurnChat);

export default threadRoutes;
