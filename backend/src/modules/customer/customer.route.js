import express from "express";
import * as customerController from "./customer.controller.js";

const router = express.Router();

router.post("/createCustomer", customerController.createCustomer);
router.get("/getCustomers", customerController.getCustomers);
router.delete("/deleteCustomer/:customerId", customerController.deleteCustomer);
router.put('/editCustomer/:customerId', customerController.editCustomer)
router.get('/:customerId', customerController.getCustomer);
export default router;
