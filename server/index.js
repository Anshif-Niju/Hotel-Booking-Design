import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import ownerRoutes from "./routes/ownerRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT, () => console.log("Server running")))
  .catch((err) => console.log(err));
