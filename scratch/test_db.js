import mongoose from 'mongoose';
import Order from '../backend/models/Order.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../backend/.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zamis-print').then(async () => {
  const order = await Order.findOne().sort({ _id: -1 });
  console.log("Latest order ID:", order._id);
  console.log("Latest order createdAt:", order.createdAt);
  process.exit(0);
});
