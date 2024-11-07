import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    carName: {
      type: String,
      required: true,
    },
    rentalDate: {
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
    perDayPrice: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalPenalty: {
      type: Number,
      default: 0,
    },
    dateOfReturn: {
      type: String,
      default: "--",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
