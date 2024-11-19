import { z } from "zod";

export const customerShcema = z.object({
  fullName: z.string({ required_error: "name is required" }),
  address: z.string({ required_error: "adress is required" }),
  gender: z.string({ required_error: "gender is required" }),
  mobile: z.string({ required_error: "mobile is required" }),
  customerImageCard: z.string({
    required_error: "customerImageCard is required",
  }),
  idCard: z.string({ required_error: "idCard is required" }),
});
