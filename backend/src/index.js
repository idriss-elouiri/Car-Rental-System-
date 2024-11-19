import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import adminAuthRouter from "./modules/adminAuth/adminAuth.route.js";
import adminUserRouter from "./modules/userAdmin/userAdmin.route.js";
import staffRouter from "./modules/staffAuth/staffAuth.route.js";
import customerRouter from "./modules/customer/customer.route.js";
import carRouter from "./modules/car/car.route.js";
import transactionRouter from "./modules/transaction/transaction.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/staff", staffRouter);
app.use("/api/adminAuth", adminAuthRouter);
app.use("/api/adminUser", adminUserRouter);
app.use("/api/customer", customerRouter);
app.use("/api/car", carRouter);
app.use("/api/transaction", transactionRouter);

app.get("/*", (req, res) => {
  res.json("hello world");
});

const port = process.env.PORT || 3006;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // Default to 500 if not set
  const message = err.message || "Internal Server Error"; // Default message

  // Log the error for server-side monitoring (optional)
  console.error(err);

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
const shutdown = () => {
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);