import express from "express";
import * as staffController from "./staffAuth.controller.js";
import { validateZod } from "../../middleware/validate-zod.js";
import { loginStaffShcema, registerStaffShcema } from "./staffAuth.shcema.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.post(
  "/registerStaff",
  validateZod(registerStaffShcema),
  staffController.registerStaffHandler
);
router.post(
  "/loginStaff",
  validateZod(loginStaffShcema),
  staffController.loginStaffHandler
);
router.put("/updateStaff/:staffId", verifyToken, staffController.updateStaff);
router.delete(
  "/deleteStaff/:staffId",
  verifyToken,
  staffController.deleteStaff
);
router.post("/signoutStaff", staffController.signoutStaff);
router.get("/getStaffs", verifyToken, staffController.getStaffs);
router.get("/:staffId", staffController.getStaff);
export default router;
