import express from "express";
import * as customerController from "./customer.controller.js";

const router = express.Router();

router.post("/createCustomer", customerController.createCustomer);
router.post("/getCustomers", customerController.getCustomers);
router.delete("/deletecustomer/:customerId", customerController.deleteCustomer);

export default router;
