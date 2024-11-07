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
router.put(
  "/editTransaction/:transactionId",
  transactionController.editTransaction
);
router.get("/:transactionId", transactionController.getTransaction);
export default router;
