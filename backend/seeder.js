import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import products from './data/products.js';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();
        
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Create an Admin user
        const createdUsers = await User.create([{
            name: 'Admin ZAMIS',
            email: 'admin@zamisprint.com',
            password: 'password123', // Will be hashed automatically by pre-save hook
            isAdmin: true
        }]);

        const adminUser = createdUsers[0]._id;

        // Add admin user to all sample products
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
