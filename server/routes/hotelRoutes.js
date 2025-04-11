import express from "express";
import { addHotel, getHotels, deleteHotel } from "../controllers/hotelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getHotels);
router.post("/", protect(["owner"]), addHotel);
router.delete("/:id", protect(["owner"]), deleteHotel);

// GET /api/hotels/my
router.get("/my", protect(["owner"]), async (req, res) => {
    const hotels = await Hotel.find({ owner: req.user._id });
    res.json(hotels);
  });

  // POST /api/hotels
router.post("/", protect(["owner"]), async (req, res) => {
  const hotel = await Hotel.create({
    ...req.body,
    owner: req.user._id,
  });
  res.status(201).json(hotel);
});

// GET /api/hotels/:id
router.get("/:id", protect(["owner"]), async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });
  res.json(hotel);
});

// PUT /api/hotels/:id
router.put("/:id", protect(["owner"]), async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });

  if (String(hotel.owner) !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const updated = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

  
  export default router;
