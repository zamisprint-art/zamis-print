import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const checkProdDB = async () => {
    try {
        const mongoUri = "mongodb://zamisprint_db_user:Hik93oO0rY1Fu2Iy@ac-biqgkeh-shard-00-00.pg3bbbk.mongodb.net:27017,ac-biqgkeh-shard-00-01.pg3bbbk.mongodb.net:27017,ac-biqgkeh-shard-00-02.pg3bbbk.mongodb.net:27017/zamis-prod?ssl=true&replicaSet=atlas-uau4bl-shard-0&authSource=admin&retryWrites=true&w=majority&appName=ZamisCluster";
        
        await mongoose.connect(mongoUri);
        console.log('Connected to Prod DB');

        const Order = mongoose.connection.collection('orders');
        const Product = mongoose.connection.collection('products');
        const User = mongoose.connection.collection('users');

        const orderCount = await Order.countDocuments();
        const productCount = await Product.countDocuments();
        const userCount = await User.countDocuments();

        console.log('Orders in Prod:', orderCount);
        console.log('Products in Prod:', productCount);
        console.log('Users in Prod:', userCount);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkProdDB();
