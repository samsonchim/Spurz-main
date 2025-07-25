# PostgreSQL Database Setup for Spurz Marketplace

## Prerequisites
- PostgreSQL 12+ installed
- pgAdmin or psql command line tool
- Database user with superuser privileges

## Quick Setup

### 1. Create Database
```sql
-- Connect as postgres superuser
CREATE DATABASE spurz_marketplace;
CREATE USER spurz_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE spurz_marketplace TO spurz_user;
```

### 2. Connect to Database
```bash
# Using psql
psql -h localhost -U spurz_user -d spurz_marketplace

# Or update your .env file
DATABASE_URL=postgresql://spurz_user:your_secure_password@localhost:5432/spurz_marketplace
```

### 3. Run SQL Scripts
```bash
# Create schema
psql -h localhost -U spurz_user -d spurz_marketplace -f database/schema.sql

# Insert sample data
psql -h localhost -U spurz_user -d spurz_marketplace -f database/sample_data.sql
```

## Database Schema Overview

### Core Tables

#### Users & Profiles
- `users` - Main user accounts (buyers, vendors, admins)
- `user_profiles` - Extended user information, location, KYC
- `user_sessions` - Authentication sessions

#### Products & Catalog
- `categories` - Product categories (hierarchical)
- `products` - Main product information
- `product_variants` - Size, color, and other variations

#### Orders & Commerce
- `orders` - Customer orders
- `order_items` - Individual items in orders
- `cart_items` - Shopping cart storage
- `favorites` - User wishlist/favorites

#### Social & Communication
- `reviews` - Product reviews and ratings
- `conversations` - Chat conversations between users
- `messages` - Individual chat messages
- `notifications` - System notifications

### Key Features

#### 🔐 Authentication & Security
- UUID primary keys for security
- Password hashing support
- Session management
- Role-based access (buyer/vendor/admin)

#### 🛍️ E-commerce Features
- Product variants (size, color, etc.)
- Inventory management
- Order processing workflow
- Shopping cart persistence
- Wishlist/favorites

#### 💬 Communication
- Real-time chat between buyers and vendors
- Product-specific conversations
- Message read status
- Notification system

#### 📊 Analytics Ready
- Comprehensive indexing
- Sales reporting queries
- User activity tracking
- Performance optimized

#### 🌍 Location Features
- User location storage (lat/lng)
- Location-based search ready
- Shipping address management

## Environment Variables

Update your `.env` file:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=spurz_marketplace
DB_USER=spurz_user
DB_PASSWORD=your_secure_password
DB_SSL=false

# For connection string
DATABASE_URL=postgresql://spurz_user:your_secure_password@localhost:5432/spurz_marketplace
```

## Sample Data Included

The database comes with sample data:
- 5 users (2 vendors, 2 buyers, 1 admin)
- 7 product categories
- 6 sample products
- 1 completed order
- Product reviews
- Chat conversation
- Notifications

## Useful Maintenance Commands

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('spurz_marketplace'));

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE is_active = true;

-- Update table statistics
ANALYZE;
```

## Backup & Restore

```bash
# Backup
pg_dump -h localhost -U spurz_user spurz_marketplace > backup.sql

# Restore
psql -h localhost -U spurz_user -d spurz_marketplace < backup.sql
```

## Next Steps

1. **Connect from Node.js**: Install `pg` package and update server.js
2. **Add Authentication**: Implement JWT with bcrypt for password hashing
3. **File Upload**: Add support for product images and user avatars
4. **Real-time Features**: Implement Socket.io for chat and notifications
5. **Search**: Add full-text search with PostgreSQL
6. **Analytics**: Create dashboard with sales and user metrics

## Production Considerations

- Use connection pooling (pg-pool)
- Enable SSL connections
- Set up regular backups
- Monitor query performance
- Implement database migrations
- Add proper logging
- Configure firewall rules
- Use environment-specific configurations
