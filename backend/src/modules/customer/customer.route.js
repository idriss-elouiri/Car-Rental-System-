import express from "express";
import * as customerController from "./customer.controller.js";

const router = express.Router();

router.post("/createCustomer", customerController.createCustomer);

export default router;
