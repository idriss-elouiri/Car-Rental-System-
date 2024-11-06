import express from "express";
import * as customerController from "./customer.controller.js";
import { validateZod } from "../../middleware/validate-zod.js";
import { customerShcema } from "./customer.shcema.js";

const router = express.Router();

router.post("/createCustomer", validateZod(customerShcema), customerController.createCustomer);
router.get("/getCustomers", customerController.getCustomers);
router.delete("/deleteCustomer/:customerId", customerController.deleteCustomer);
router.put('/editCustomer/:customerId', customerController.editCustomer)
router.get('/:customerId', customerController.getCustomer);
export default router;
