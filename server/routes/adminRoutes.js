import express from "express";
import { getOwners, deleteOwner } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();



router.get("/owners", protect(["admin"]), getOwners);
router.delete("/owners/:id", protect(["admin"]), deleteOwner);

// Get all hotel owners
router.get("/owners", protect(["admin"]), async (req, res) => {
    const owners = await User.find({ role: "owner" }).select("-password");
    res.json(owners);
  });
  
  // Delete a hotel owner
  router.delete("/owners/:id", protect(["admin"]), async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Hotel owner deleted" });
  });
  
  // Get all hotels
  router.get("/hotels", protect(["admin"]), async (req, res) => {
    const hotels = await Hotel.find().populate("owner", "name email");
    res.json(hotels);
  });
  
  // Delete a hotel
  router.delete("/hotels/:id", protect(["admin"]), async (req, res) => {
    await Hotel.findByIdAndDelete(req.params.id);
    res.json({ message: "Hotel deleted" });
  });
  


export default router;
