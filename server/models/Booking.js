import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
  date: Date,
  amount: Number,
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking; 
