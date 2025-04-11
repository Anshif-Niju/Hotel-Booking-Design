import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Booking from "../models/bookingModel.js";


const router = express.Router();

// Owner - Get bookings on their hotels
router.get("/bookings", protect(["owner"]), async (req, res) => {
  const hotels = await Hotel.find({ owner: req.user._id }).select("_id");

  const hotelIds = hotels.map(h => h._id);

  const bookings = await Booking.find({ hotel: { $in: hotelIds } })
    .populate("hotel")
    .populate("user", "name email");

  res.json(bookings);
});

export default router;
