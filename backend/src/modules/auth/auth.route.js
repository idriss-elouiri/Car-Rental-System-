import express from "express";
import * as authController from "./auth.controller.js";

const router = express.Router();

router.post("/register", authController.registerHandler);
router.post("/login", authController.loginHandler);

export default router;
