import express from "express";
import * as transactionController from "./transaction.controller.js";
import { transactionShcema } from "./transaction.shcema.js";
import { validateZod } from "../../middleware/validate-zod.js";

const router = express.Router();

router.post(
  "/createTransaction",
  validateZod(transactionShcema),
  transactionController.createTransaction
);
router.get("/getTransactions", transactionController.getTransactions);
router.delete(
  "/deleteTransaction/:transactionId",
  transactionController.deleteTransaction
);
router.get("/:transactionId", transactionController.getTransaction);
router.put(
  "/editTransaction/:transactionId",
  transactionController.editTransaction
);
router.get("/sales-overview", transactionController.getSalesOverview);

export default router;
