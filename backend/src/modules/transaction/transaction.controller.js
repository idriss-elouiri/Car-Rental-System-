import { errorHandler } from "../../utils/error.js";
import Car from "../car/car.model.js";
import Transaction from "./transaction.model.js";

export const createTransaction = async (req, res, next) => {
  try {
    console.log(req.body.carName);
    const car = await Car.findOne({ name: req.body.carName });

    if (!car || car.carStatus === "Not Available") {
      return res.status(400).json({ message: "Car Not Available" });
    }
    console.log(car);
    car.carStatus = "Not Available";
    car.rentalCount += 1; // Increment the rental count
    await car.save(); // Save the updated car info
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
    const { transactionId } = req.params;

    if (transactionId === "sales-overview") {
      // Call the sales overview function instead
      return getSalesOverview(req, res);
    }

    // Proceed with the normal findById function if it's a valid ObjectId
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return next(errorHandler(404, "Transaction not found"));
    }
    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error); // Log error for debugging
    next(error);
  }
};

export const getSalesOverview = async (req, res) => {
  try {
    // Fetch all transactions
    const transactions = await Transaction.find({});

    // Calculate total revenue
    const totalRevenue = transactions.reduce(
      (sum, transaction) => sum + transaction.totalPrice,
      0
    );

    // Calculate the total number of transactions
    const totalTransactions = transactions.length;

    // Prepare monthly overview data
    const monthlyMap = {};

    transactions.forEach(({ rentalDate, totalPrice }) => {
      const date = new Date(rentalDate);
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format "MM-YYYY"

      if (!monthlyMap[monthYear]) {
        monthlyMap[monthYear] = { totalRevenue: 0, date };
      }
      monthlyMap[monthYear].totalRevenue += totalPrice;
    });

    // Convert map to array, adding formatted date and month name
    const monthlyOverview = Object.keys(monthlyMap)
      .map((key) => {
        const { totalRevenue, date } = monthlyMap[key];
        const formattedDate = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()}`;
        const monthName = date.toLocaleString("default", { month: "long" });

        return {
          _id: key, // This should not be an ObjectId, it's a string
          totalRevenue,
          monthName,
          date: formattedDate,
        };
      })
      .sort((a, b) => new Date(`01-${a._id}`) - new Date(`01-${b._id}`));

    res.status(200).json({
      totalTransactions,
      totalRevenue,
      monthlyOverview,
    });
  } catch (error) {
    console.error("Error fetching sales overview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
