# Spurz API Backend

A simple Node.js/Express backend API for the Spurz marketplace application.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Navigate to the API directory:
```bash
cd API
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Endpoints

### Base URL
```
http://localhost:3000
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/health` | Health check |
| GET | `/api/test` | API test endpoint |
| GET | `/api/products` | Get sample products |

### Example Responses

#### Welcome Endpoint (`GET /`)
```json
{
  "message": "🚀 Spurz Backend API is working!",
  "status": "success",
  "timestamp": "2025-01-25T10:30:00.000Z",
  "version": "1.0.0"
}
```

#### Products Endpoint (`GET /api/products`)
```json
{
  "message": "Products retrieved successfully",
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Fresh Pears",
      "brand": "Local Farm",
      "price": 10.99,
      "category": "fruits",
      "inStock": true,
      "image": "/images/pears.jpg"
    }
  ]
}
```

## 🛠️ Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (not implemented yet)

### Environment Variables
Copy `.env.example` to `.env` and configure:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## 📁 Project Structure
```
API/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🔧 Features
- ✅ Express.js server
- ✅ CORS enabled
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)
- ✅ JSON parsing
- ✅ Error handling
- ✅ Health check endpoint
- ✅ Sample API routes

## 🔮 Future Enhancements
- Database integration (MongoDB/PostgreSQL)
- User authentication (JWT)
- Product CRUD operations
- Order management
- Real-time chat (Socket.io)
- File upload handling
- API documentation (Swagger)
- Unit tests
- Rate limiting
- Input validation

## 📝 Testing
Visit `http://localhost:3000` in your browser to see if the backend is working!
