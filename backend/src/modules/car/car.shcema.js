import { z } from "zod";

export const carShcema = z.object({
  name: z.string({ required_error: "name is required" }),
  carNumber: z.string({ required_error: "carNumber is required" }),
  color: z.string({ required_error: "color is required" }),
  vehicleYear: z.string({ required_error: "productYear is required" }),
  carImage: z
  .string({ required_error: "carImage is required" }),
  carStatus: z.string({ required_error: "carStatus is required" }),
});
