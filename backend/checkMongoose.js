import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

const checkMongoose = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to:', mongoose.connection.client.s.url);
    console.log('Database name:', mongoose.connection.db.databaseName);
    
    const count = await Product.countDocuments();
    console.log('Products count via Mongoose Model:', count);
    
    const userCount = await User.countDocuments();
    console.log('Users count via Mongoose Model:', userCount);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkMongoose();
