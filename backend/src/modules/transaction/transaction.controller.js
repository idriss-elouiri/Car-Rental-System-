import { errorHandler } from "../../utils/error.js";
import Car from "../car/car.model.js";
import Transaction from "./transaction.model.js";

export const createTransaction = async (req, res, next) => {
  try {
    const car = await Car.findOne({ name: req.body.carName });
    if (!car || car.carStatus === "Not Available") {
      return res.status(400).json({ message: "السيارة غير متاحة" });
    }
    console.log(car);
    car.carStatus = "Not Available";
    await car.save();
    console.log(car);

    const newTransaction = new Transaction({
      rentalDate: new Date(),
      ...req.body,
    });

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
      req.params.transactionId
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
    // Update the transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.transactionId,
      { $set: { ...req.body } },
      { new: true, runValidators: true } // Ensure validation is applied on update
    );

    if (!updatedTransaction) {
      return next(errorHandler(404, "Transaction not found"));
    }

    // Check if the transaction is marked as completed
    if (req.body.isCompleted && req.body.carName) {
      const car = await Car.findOne({ name: req.body.carName });

      if (car && car.carStatus === "Not Available") {
        // Change car status to Available if the transaction is completed
        car.carStatus = "Available";
        await car.save();
        console.log("Car status updated to Available");
      }
    }

    // Return the updated transaction
    res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
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
