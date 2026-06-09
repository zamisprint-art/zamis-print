import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import Order from './models/Order.js';

async function run() {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zamis-print');
    
    // Get latest order
    let order = await Order.findOne().sort({ _id: -1 });
    console.log("1. Original createdAt:", order.createdAt);
    
    // Simulate updateBillingStatus logic
    let reqBodyCreatedAt = "2026-06-01"; // What frontend sends
    let newCreatedAt;
    
    if (typeof reqBodyCreatedAt === 'string' && reqBodyCreatedAt.length === 10) {
        newCreatedAt = new Date(`${reqBodyCreatedAt}T12:00:00`);
    } else {
        newCreatedAt = new Date(reqBodyCreatedAt);
    }
    
    order.createdAt = newCreatedAt;
    let updatedOrder = await order.save();
    console.log("2. After order.save() in memory:", updatedOrder.createdAt);
    
    await Order.collection.updateOne({ _id: updatedOrder._id }, { $set: { createdAt: newCreatedAt } });
    updatedOrder.createdAt = newCreatedAt;
    
    console.log("3. After collection.updateOne() in memory:", updatedOrder.createdAt);
    
    // Fetch from DB
    let verifyOrder = await Order.findById(order._id);
    console.log("4. Fetched from DB:", verifyOrder.createdAt);
    
    // Simulate what the browser does
    let browserDate = new Date(verifyOrder.createdAt).toLocaleDateString('es-CO');
    console.log("5. Browser displays:", browserDate);
    
    process.exit(0);
}
run();
