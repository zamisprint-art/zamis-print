import path from 'path';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://zamis-print.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Render health checks, UptimeRobot)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

// Routes
app.use('/api/users', userRoutes);

// Keep-Alive Ping Route for UptimeRobot/Render
app.get('/api/ping', (req, res) => {
  res.status(200).send('Server is awake');
});

// Temporary setup route to create admin user in production (DELETE AFTER USE)
app.get('/api/setup', async (req, res) => {
  const { secret } = req.query;
  if (secret !== 'zamis-setup-2026') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const { default: User } = await import('./models/User.js');
    const bcrypt = await import('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('ZamisAdmin2026!', salt);

    // Use updateOne to bypass pre-save hook and avoid double hashing
    const existing = await User.findOne({ email: 'admin@zamisprint.com' });
    if (existing) {
      await User.updateOne(
        { email: 'admin@zamisprint.com' },
        { $set: { password: hashedPassword, isAdmin: true } }
      );
      return res.json({ message: '✅ Admin password reset!', email: 'admin@zamisprint.com', password: 'ZamisAdmin2026!' });
    }
    await User.create({
      name: 'Admin ZAMIS',
      email: 'admin@zamisprint.com',
      password: hashedPassword,
      isAdmin: true
    });
    res.json({ message: '✅ Admin created!', email: 'admin@zamisprint.com', password: 'ZamisAdmin2026!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api', (req, res) => {
    res.json({ message: 'ZAMIS Print API is running...' });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
