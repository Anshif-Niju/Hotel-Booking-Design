import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";

const router = express.Router();

// @route   POST /api/users/register
router.post("/register", registerUser);

// @route   POST /api/users/login
router.post("/login", loginUser);

// @route   GET /api/users/profile/:id
router.get("/profile/:id", getUserProfile);

export default router;
