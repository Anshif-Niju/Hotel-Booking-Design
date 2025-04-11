import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['client', 'owner', 'admin'],
    default: 'client'
  }
  // Add other fields as needed
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
