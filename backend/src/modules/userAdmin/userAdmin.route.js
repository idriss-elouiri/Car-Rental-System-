import express from "express";
import * as adminController from "./userAdmin.controller.js";
import { verifyToken } from "../../utils/verifyUser.js";

const router = express.Router();

router.put("/update/:adminId", verifyToken, adminController.updateAdmin);
router.delete("/delete/:adminId", verifyToken, adminController.deleteAdmin);
router.post("/signout", adminController.signout);
router.get("/getadmins", verifyToken, adminController.getAdmins);
router.get("/:adminId", adminController.getAdmin);
router.put("/adminUpdateStaff/:staffId", adminController.updateStaff);
router.delete("/adminDeleteStaff/:staffId", adminController.deleteStaff);

export default router;
