import Hotel from "../models/Hotel.js";

export const addHotel = async (req, res) => {
  const hotel = await Hotel.create({ ...req.body, owner: req.user.id });
  res.json(hotel);
};

export const getHotels = async (req, res) => {
  const hotels = await Hotel.find().populate("owner", "name");
  res.json(hotels);
};

export const deleteHotel = async (req, res) => {
  await Hotel.findByIdAndDelete(req.params.id);
  res.json({ message: "Hotel deleted" });
};
