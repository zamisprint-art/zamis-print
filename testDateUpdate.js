import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import Order from './backend/models/Order.js';

async function run() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zamis-print');
    const order = await Order.findOne().sort({ _id: -1 });
    console.log("Original createdAt:", order.createdAt);
    
    const newDate = new Date("2026-06-01T12:00:00");
    await Order.collection.updateOne({ _id: order._id }, { $set: { createdAt: newDate } });
    
    const updated = await Order.findById(order._id);
    console.log("Updated createdAt:", updated.createdAt);
    process.exit(0);
}

run();
