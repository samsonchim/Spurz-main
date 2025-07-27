const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `https://6f81e3710c41.ngrok-free.app:${PORT}`;

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
      name: 'Fresh Organic Apples',
      brand: 'Green Valley',
      price: 2500,
      originalPrice: 3000,
      discount: 17,
      category: 'fruits',
      rating: 4.8,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop',
      isHot: true
    },
    {
      id: 2,
      name: 'Premium Oranges',
      brand: 'Citrus Fresh',
      price: 1800,
      originalPrice: 2200,
      discount: 18,
      category: 'fruits',
      rating: 4.6,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Ripe Bananas',
      brand: 'Tropical Best',
      price: 1200,
      category: 'fruits',
      rating: 4.5,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Fresh Watermelon',
      brand: 'Summer Fresh',
      price: 3500,
      originalPrice: 4000,
      discount: 13,
      category: 'fruits',
      rating: 4.7,
      inStock: false,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop',
      isHot: true
    },
    {
      id: 5,
      name: 'Sweet Strawberries',
      brand: 'Berry Best',
      price: 4200,
      originalPrice: 5000,
      discount: 16,
      category: 'fruits',
      rating: 4.9,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop',
      isHot: true
    },
    {
      id: 6,
      name: 'Fresh Pineapple',
      brand: 'Tropical Fresh',
      price: 2800,
      category: 'fruits',
      rating: 4.4,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=300&h=300&fit=crop'
    }
  ];

  // Simulate random data refresh by shuffling products
  const shuffledProducts = [...sampleProducts].sort(() => Math.random() - 0.5);

  res.json({
    success: true,
    message: 'Products retrieved successfully',
    count: shuffledProducts.length,
    data: shuffledProducts,
    timestamp: new Date().toISOString()
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
