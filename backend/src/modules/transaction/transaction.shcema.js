import { z } from "zod";

export const transactionShcema = z.object({
  customerName: z.string({ required_error: "customerName is required" }),
  transactionName: z.string({ required_error: "transactionName is required" }),
  borrowDate: z.string({ required_error: "borrowDate is required" }),
  returnDate: z.string({ required_error: "returnDate is required" }),
  perDayPirce: z.string({ required_error: "perDayPirce is required" }),
  totalPrice: z.number({ required_error: "totalPrice is required" }),
});
