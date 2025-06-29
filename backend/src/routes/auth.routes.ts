import { Router } from "express";

import { google, login, logout, signup } from "@/controller/auth.controller";
import { authMiddleware } from "@/middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post("/auth/signup", signup);

authRoutes.post("/auth/login", login);
authRoutes.post("/auth/google", google);

authRoutes.post("/auth/logout", logout);

export default authRoutes;
