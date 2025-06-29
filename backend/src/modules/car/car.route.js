import express from "express";
import * as carController from "./car.controller.js";
import { validateZod } from "../../middleware/validate-zod.js";
import { carShcema } from "./car.shcema.js";

const router = express.Router();

router.post("/createCar", validateZod(carShcema), carController.createCar);
router.get("/getCars", carController.getCars);
router.delete("/deleteCar/:carId", carController.deleteCar);
router.put("/editCar/:carId", carController.editCar);
router.get("/:carId", carController.getCar);
export default router;
