import { z } from "zod";

export const transactionShcema = z.object({
  customerName: z.string({ required_error: "customerName is required" }),
  carName: z.string({ required_error: "carName is required" }),
  borrowDate: z.string({ required_error: "borrowDate is required" }),
  returnDate: z.string({ required_error: "returnDate is required" }),
  perDayPrice: z.string({ required_error: "perDayPirce is required" }),
  totalPrice: z.number({ required_error: "totalPrice is required" }),
});
