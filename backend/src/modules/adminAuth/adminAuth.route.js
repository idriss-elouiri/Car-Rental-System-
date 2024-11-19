import express from "express";
import * as authController from "./adminAuth.controller.js";
import { registerShcema, loginShcema } from "./adminAuth.shcema.js";
import { validateZod } from "../../middleware/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  authController.registerHandler
);
router.post("/login", validateZod(loginShcema), authController.loginHandler);
router.post("/google", authController.googleHandler);


export default router;