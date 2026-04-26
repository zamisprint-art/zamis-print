import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if admin already exists
        const existing = await User.findOne({ email: 'admin@zamisprint.com' });
        if (existing) {
            console.log('Admin user already exists!');
            process.exit();
        }

        await User.create({
            name: 'Admin ZAMIS',
            email: 'admin@zamisprint.com',
            password: 'ZamisAdmin2026!',
            isAdmin: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@zamisprint.com');
        console.log('Password: ZamisAdmin2026!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
