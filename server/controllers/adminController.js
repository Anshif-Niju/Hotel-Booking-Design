import User from "../models/User.js";

export const getOwners = async (req, res) => {
  const owners = await User.find({ role: "owner" });
  res.json(owners);
};

export const deleteOwner = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Owner deleted" });
};
