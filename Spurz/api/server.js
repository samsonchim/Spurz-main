const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Spurz Backend API is working!',
    status: 'success',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    baseUrl: BASE_URL
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    baseUrl: BASE_URL
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// API routes
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API endpoint is working!',
    data: {
      marketplace: 'Spurz',
      features: ['Products', 'Users', 'Orders', 'Chat', 'Reviews'],
      endpoints: ['/api/auth/signup', '/api/auth/login', '/api/products', '/api/users', '/api/orders'],
      baseUrl: BASE_URL
    }
  });
});

// Sample products endpoint
app.get('/api/products', (req, res) => {
  const sampleProducts = [
    {
      id: 1,
      name: 'Fresh Pears',
      brand: 'Local Farm',
      price: 10.99,
      category: 'fruits',
      inStock: true,
      image: '/images/pears.jpg'
    },
    {
      id: 2,
      name: 'Watermelon Slices',
      brand: 'Fresh Market',
      price: 8.99,
      category: 'fruits',
      inStock: true,
      image: '/images/watermelon.jpg'
    },
    {
      id: 3,
      name: 'Grilled Meat',
      brand: 'BBQ House',
      price: 15.99,
      category: 'food',
      inStock: false,
      image: '/images/meat.jpg'
    }
  ];

  res.json({
    message: 'Products retrieved successfully',
    count: sampleProducts.length,
    data: sampleProducts
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    status: 'error',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    status: 'error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 =================================');
  console.log(`🚀 Spurz API Server is running!`);
  console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 URL: http://localhost:${PORT}`);
  console.log('🚀 =================================');
});

module.exports = app;
