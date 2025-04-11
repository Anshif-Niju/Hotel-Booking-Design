import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  price: Number,
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  images: [String],
  availableDates: [Date]
  // Add other fields as needed
}, { timestamps: true });

const Hotel = mongoose.models.Hotel || mongoose.model('Hotel', hotelSchema);
export default Hotel;
