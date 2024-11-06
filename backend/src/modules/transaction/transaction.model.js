import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    transactionName: {
      type: String,
      required: true,
    },
    borrowDate: {
      type: String,
      required: true,
    },
    returnDate: {
      type: String,
      required: true,
    },
    perDayPirce: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    dateOfReturn: {
      type: String,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
