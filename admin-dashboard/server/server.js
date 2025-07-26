import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Import routes
import adminRouter from './routes/adminRoute.js';
import userRouter from './routes/userRoute.js';
import medicineRouter from './routes/medicineRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import searchRouter from './routes/searchRoute.js';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Security middleware
app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'UzimaAI Admin API');
  next();
});

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 86400
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// API Routes
app.use('/api/admin', adminRouter);
app.use('/api/admin/users', userRouter);
app.use('/api/admin/medicines', medicineRouter);
app.use('/api/admin/reviews', reviewRouter);
app.use('/api/admin/search-history', searchRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'UzimaAI Admin API Running 🚀',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

app.listen(port, () => {
  console.log(`\n🚀 UzimaAI Admin API Server Started!`);
  console.log(`📍 Port: ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${port}/`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/\n`);
});
