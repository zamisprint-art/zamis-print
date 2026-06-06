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
import inventoryRoutes from './routes/inventoryRoutes.js';
import slideRoutes from './routes/slideRoutes.js';
import homeSectionRoutes from './routes/homeSectionRoutes.js';
import categoryLinkRoutes from './routes/categoryLinkRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://zamisprint.com',
  'https://www.zamisprint.com',
  'https://zamisprint.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean);

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

// Basic Security Headers
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' })); // Para permitir que el frontend cargue imágenes desde el backend si es necesario

// Rate Limiting (Protección contra fuerza bruta y DoS)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 500, // Límite de 500 peticiones por IP cada 10 min
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);


// Reducimos el límite de carga de 150mb a 10mb
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Database connection
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
        const conn = await mongoose.connect(uri);
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


app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/homesections', homeSectionRoutes);
app.use('/api/categorylinks', categoryLinkRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/expenses', expenseRoutes);

// Make uploads folder static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/api', (req, res) => {
    res.json({ message: 'ZAMIS Print API is running...' });
});

// Manejo Global de Errores
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
