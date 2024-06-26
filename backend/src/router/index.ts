import { Router } from "express";

import authRouter from "./auth.router";
import userRouter from "./user.router";
import todoRouter from "./todo.router";

const router = Router();

// health check
router.get("/healthcheck", (req, res) => {
    return res.status(200).json({ 
        status: "ok",
        message: "Server is running",
        uptime: process.uptime()
     });
});

// auth routes
router.use("/auth", authRouter);

// user routes
router.use("/user", userRouter);

// todo routes
router.use("/todo", todoRouter);

export default router;