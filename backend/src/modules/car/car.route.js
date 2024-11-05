import express from "express";
import * as carController from "./car.controller.js";

const router = express.Router();

router.post("/createCar", carController.createCar);
router.get("/getCars", carController.getCars);
router.delete("/deleteCar/:carId", carController.deleteCar);
router.put('/editCar/:carId', carController.editCar)
router.get('/:carId', carController.getCar);
export default router;
