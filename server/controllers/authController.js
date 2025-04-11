import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser  = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashed });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "User exists" });
  }
};

export const loginUser  = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const match = user && await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(401).json({ message: "Invalid" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, role: user.role });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user profile" });
  }
};


