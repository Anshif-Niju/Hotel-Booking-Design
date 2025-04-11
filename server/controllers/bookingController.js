import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

export const bookHotel = async (req, res) => {
  const { hotelId, date, amount } = req.body;
  const booking = await Booking.create({ user: req.user.id, hotel: hotelId, date, amount });
  await Hotel.findByIdAndUpdate(hotelId, { $push: { bookings: date } });
  res.json(booking);
};
