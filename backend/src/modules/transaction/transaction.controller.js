import { errorHandler } from "../../utils/error.js";
import Transaction from "./transaction.model.js";

export const createTransaction = async (req, res, next) => {
  const newTransaction = new Transaction({
    ...req.body,
  });

  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error); // Log error for debugging
    next(error);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const transactions = await Transaction.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex);

    const totalTransactions = await Transaction.countDocuments();

    // Get the count of Cars created in the last month
    const lastMonthTransactionsCount = await Transaction.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      transactions,
      totalTransactions,
      lastMonthTransactions: lastMonthTransactionsCount,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error); // Log error for debugging
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.carId
    );
    if (!deletedTransaction) {
      return next(errorHandler(404, "Transaction not found"));
    }
    res.status(200).json({ message: "The transaction has been deleted" });
  } catch (error) {
    console.error("Error deleting car:", error); // Log error for debugging
    next(error);
  }
};

export const editTransaction = async (req, res, next) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      { $set: { ...req.body } }, // Use spread operator for flexibility
      { new: true, runValidators: true } // Ensures validation on update
    );

    if (!updatedTransaction) {
      return next(errorHandler(404, "Transaction not found"));
    }

    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error); // Log error for debugging
    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return next(errorHandler(404, "transaction not found"));
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error); // Log error for debugging
    next(error);
  }
};
