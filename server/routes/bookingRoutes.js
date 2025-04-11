import express from "express";
import { bookHotel } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
import Booking from "../models/bookingModel.js";
// import Stripe from "stripe";

const router = express.Router();

// Create a booking
router.post("/", protect(["client"]), bookHotel);

router.post("/", protect(["client"]), async (req, res) => {
  const { hotelId, checkIn, checkOut } = req.body;
  

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });

  const totalDays = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );

  const totalPrice = totalDays * hotel.price;

  const booking = new Booking({
    hotel: hotelId,
    user: req.user._id,
    checkIn,
    checkOut,
    totalPrice,
  });

  await booking.save();
  res.status(201).json(booking);
});

// Get bookings for a hotel (for calendar)
router.get("/hotel/:id", async (req, res) => {
  const bookings = await Booking.find({ hotel: req.params.id });
  res.json(bookings);
});


// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // add this at top
// // Payment intent route
// router.post("/payment-intent", protect(["client"]), async (req, res) => {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: req.body.amount,
//       currency: "usd",
//     });

//     res.send(paymentIntent.client_secret);
//   } catch (err) {
//     console.error("Stripe error", err);
//     res.status(500).json({ error: "Payment failed" });
//   }
// });

router.post("/create-checkout-session", async (req, res) => {
  try {
    // Simulate successful payment
    res.status(200).json({
      success: true,
      message: "Payment simulated (Stripe disabled)",
      sessionId: "dummy_session_id",
      url: "/payment-success", // Optional fake redirect
    });
  } catch (error) {
    res.status(500).json({ error: "Payment simulation failed" });
  }
});



// Get bookings for logged-in client
router.get("/my", protect(["client"]), async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate("hotel");
  res.json(bookings);
});


// // Create Stripe checkout session
// router.post("/checkout", protect(["client"]), async (req, res) => {
//   const { hotelId, checkIn, checkOut } = req.body;

//   const hotel = await Hotel.findById(hotelId);
//   if (!hotel) return res.status(404).json({ message: "Hotel not found" });

//   const nights =
//     (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
//   const amount = hotel.price * nights;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     line_items: [
//       {
//         price_data: {
//           currency: "inr",
//           product_data: {
//             name: hotel.name,
//             images: [hotel.image],
//           },
//           unit_amount: hotel.price * 100,
//         },
//         quantity: nights,
//       },
//     ],
//     mode: "payment",
//     success_url: "http://localhost:3000/success",
//     cancel_url: "http://localhost:3000/cancel",
//   });

//   res.json({ url: session.url });
// });


export default router;
