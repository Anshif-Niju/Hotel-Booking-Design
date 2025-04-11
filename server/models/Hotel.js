import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: String,
  city: String,
  price: Number,
  image: String,
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookings: [Date],
});



export default mongoose.model("Hotel", hotelSchema);
