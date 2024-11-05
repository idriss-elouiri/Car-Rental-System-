import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./modules/auth/auth.route.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();

connectDb();

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Your frontend origin
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRouter);

app.get("/*", (req, res) => {
  res.json("hello world");
});

app.listen(3006, () => {
  console.log("Server is running on port 3006!");
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
