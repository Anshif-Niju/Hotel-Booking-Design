import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs"; // ✅ Import bcrypt
import Hotel from "./models/hotelmodel.js";
import User from "./models/usermodel.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const seedDemoUser = async () => {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.create({
    name: "Demo User",
    email: "demo@example.com",
    password: hashedPassword,
    role: "client",
  });

  console.log("✅ Demo user added");
};

const hotelImages = [
  "https://source.unsplash.com/featured/?hotel,room",
  "https://source.unsplash.com/featured/?resort",
  "https://source.unsplash.com/featured/?luxury-hotel",
];

const demoOwners = [
  {
    name: "Owner One",
    email: "owner1@example.com",
    password: await bcrypt.hash("owner123", 10),
    role: "owner",
  },
  {
    name: "Owner Two",
    email: "owner2@example.com",
    password: await bcrypt.hash("owner123", 10),
    role: "owner",
  },
];

const demoHotels = [
  {
    name: "Skyline Suites",
    city: "Mumbai",
    price: 3500,
    imageUrls: [hotelImages[0]],
  },
  {
    name: "Ocean Breeze Resort",
    city: "Goa",
    price: 5000,
    imageUrls: [hotelImages[1]],
  },
  {
    name: "Himalayan Heights",
    city: "Manali",
    price: 4200,
    imageUrls: [hotelImages[2]],
  },
];

const seedData = async () => {
  try {
    await Hotel.deleteMany();
    await User.deleteMany({ role: "owner" });

    const insertedOwners = await User.insertMany(demoOwners);

    const hotelsWithOwner = demoHotels.map((hotel, i) => ({
      ...hotel,
      owner: insertedOwners[i % insertedOwners.length]._id,
    }));

    await Hotel.insertMany(hotelsWithOwner);

    console.log("✅ Demo hotels and owners seeded");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
};

const runSeeder = async () => {
  await seedDemoUser();
  await seedData();
  mongoose.disconnect();
};

runSeeder();
