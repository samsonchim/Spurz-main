-- Sample Data for Spurz Marketplace Database
-- Run this after creating the schema

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
    (uuid_generate_v4(), 'Electronics', 'electronics', 'Electronic devices and gadgets', 'phone'),
    (uuid_generate_v4(), 'Clothing', 'clothing', 'Fashion and apparel', 'shirt'),
    (uuid_generate_v4(), 'Food & Beverages', 'food-beverages', 'Fresh food and drinks', 'restaurant'),
    (uuid_generate_v4(), 'Home & Garden', 'home-garden', 'Home improvement and garden supplies', 'home'),
    (uuid_generate_v4(), 'Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', 'fitness'),
    (uuid_generate_v4(), 'Books & Education', 'books-education', 'Books and educational materials', 'book'),
    (uuid_generate_v4(), 'Beauty & Health', 'beauty-health', 'Beauty products and health items', 'heart');

-- Insert sample users (vendors and buyers)
INSERT INTO users (id, email, password_hash, full_name, phone, user_type, is_verified) VALUES
    (uuid_generate_v4(), 'john.vendor@example.com', '$2b$10$hashed_password_here', 'John Smith', '+1234567890', 'vendor', true),
    (uuid_generate_v4(), 'sarah.buyer@example.com', '$2b$10$hashed_password_here', 'Sarah Johnson', '+1234567891', 'buyer', true),
    (uuid_generate_v4(), 'mike.vendor@example.com', '$2b$10$hashed_password_here', 'Mike Brown', '+1234567892', 'vendor', true),
    (uuid_generate_v4(), 'emma.buyer@example.com', '$2b$10$hashed_password_here', 'Emma Davis', '+1234567893', 'buyer', true),
    (uuid_generate_v4(), 'admin@spurz.com', '$2b$10$hashed_password_here', 'Admin User', '+1234567894', 'admin', true);

-- Get category and user IDs for foreign key references
DO $$
DECLARE
    electronics_id UUID;
    clothing_id UUID;
    food_id UUID;
    vendor1_id UUID;
    vendor2_id UUID;
    buyer1_id UUID;
    buyer2_id UUID;
BEGIN
    -- Get category IDs
    SELECT id INTO electronics_id FROM categories WHERE slug = 'electronics' LIMIT 1;
    SELECT id INTO clothing_id FROM categories WHERE slug = 'clothing' LIMIT 1;
    SELECT id INTO food_id FROM categories WHERE slug = 'food-beverages' LIMIT 1;
    
    -- Get user IDs
    SELECT id INTO vendor1_id FROM users WHERE email = 'john.vendor@example.com' LIMIT 1;
    SELECT id INTO vendor2_id FROM users WHERE email = 'mike.vendor@example.com' LIMIT 1;
    SELECT id INTO buyer1_id FROM users WHERE email = 'sarah.buyer@example.com' LIMIT 1;
    SELECT id INTO buyer2_id FROM users WHERE email = 'emma.buyer@example.com' LIMIT 1;

    -- Insert sample products
    INSERT INTO products (id, vendor_id, category_id, name, slug, description, short_description, price, compare_price, stock_quantity, sku, images, is_featured) VALUES
        (uuid_generate_v4(), vendor1_id, electronics_id, 'iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced features and powerful performance', 'Latest iPhone with cutting-edge technology', 999.99, 1099.99, 50, 'IPH15PRO001', '["https://example.com/iphone1.jpg", "https://example.com/iphone2.jpg"]', true),
        (uuid_generate_v4(), vendor1_id, electronics_id, 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Premium Android smartphone with excellent camera', 'Premium Samsung smartphone', 899.99, 999.99, 30, 'SAM24001', '["https://example.com/samsung1.jpg"]', true),
        (uuid_generate_v4(), vendor2_id, clothing_id, 'Premium Cotton Jacket', 'premium-cotton-jacket', 'High-quality cotton jacket perfect for all seasons', 'Premium cotton jacket for all seasons', 75.00, 90.00, 25, 'JACKET001', '["https://example.com/jacket1.jpg", "https://example.com/jacket2.jpg"]', false),
        (uuid_generate_v4(), vendor2_id, clothing_id, 'Casual Shirt', 'casual-shirt', 'Comfortable casual shirt made from breathable fabric', 'Comfortable casual shirt', 48.00, 60.00, 40, 'SHIRT001', '["https://example.com/shirt1.jpg"]', false),
        (uuid_generate_v4(), vendor1_id, food_id, 'Fresh Organic Pears', 'fresh-organic-pears', 'Locally sourced organic pears, perfect for healthy snacking', 'Fresh organic pears', 10.99, 12.99, 100, 'PEAR001', '["https://example.com/pears1.jpg"]', true),
        (uuid_generate_v4(), vendor2_id, food_id, 'Premium Watermelon', 'premium-watermelon', 'Sweet and juicy watermelon, perfect for summer', 'Sweet and juicy watermelon', 8.99, 10.99, 80, 'WATER001', '["https://example.com/watermelon1.jpg"]', false);

    -- Insert product variants for clothing items
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) 
    SELECT id, 'Black - Medium', 'JACKET001-BLK-M', 75.00, 10, '{"color": "black", "size": "medium"}'
    FROM products WHERE slug = 'premium-cotton-jacket';
    
    INSERT INTO product_variants (product_id, name, sku, price, stock_quantity, attributes) 
    SELECT id, 'Blue - Large', 'SHIRT001-BLU-L', 48.00, 15, '{"color": "blue", "size": "large"}'
    FROM products WHERE slug = 'casual-shirt';

    -- Insert user profiles
    INSERT INTO user_profiles (user_id, bio, location, latitude, longitude, kyc_verified) VALUES
        (vendor1_id, 'Electronics specialist with 10+ years experience', 'New York, NY', 40.7128, -74.0060, true),
        (vendor2_id, 'Fashion and lifestyle products vendor', 'Los Angeles, CA', 34.0522, -118.2437, true),
        (buyer1_id, 'Tech enthusiast and shopaholic', 'Chicago, IL', 41.8781, -87.6298, false),
        (buyer2_id, 'Fashion lover and food connoisseur', 'Miami, FL', 25.7617, -80.1918, false);

    -- Insert sample order
    INSERT INTO orders (id, customer_id, order_number, status, payment_status, subtotal, tax_amount, shipping_amount, total_amount, shipping_address) VALUES
        (uuid_generate_v4(), buyer1_id, 'ORD-001-2025', 'delivered', 'paid', 999.99, 79.99, 9.99, 1089.97, '{"name": "Sarah Johnson", "address": "123 Main St", "city": "Chicago", "state": "IL", "zip": "60601", "country": "USA"}');

    -- Insert order items
    INSERT INTO order_items (order_id, product_id, vendor_id, product_name, product_sku, price, quantity, total)
    SELECT o.id, p.id, p.vendor_id, p.name, p.sku, p.price, 1, p.price
    FROM orders o, products p 
    WHERE o.order_number = 'ORD-001-2025' AND p.slug = 'iphone-15-pro';

    -- Insert sample reviews
    INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase) 
    SELECT p.id, buyer1_id, 5, 'Excellent phone!', 'Love the camera quality and battery life. Highly recommended!', true
    FROM products p WHERE p.slug = 'iphone-15-pro';

    INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase) 
    SELECT p.id, buyer2_id, 4, 'Great jacket', 'Very comfortable and stylish. Good quality material.', false
    FROM products p WHERE p.slug = 'premium-cotton-jacket';

    -- Insert sample cart items
    INSERT INTO cart_items (user_id, product_id, quantity) 
    SELECT buyer2_id, p.id, 2
    FROM products p WHERE p.slug = 'fresh-organic-pears';

    -- Insert favorites
    INSERT INTO favorites (user_id, product_id) 
    SELECT buyer1_id, p.id
    FROM products p WHERE p.slug IN ('samsung-galaxy-s24', 'premium-cotton-jacket');

    -- Insert conversation
    INSERT INTO conversations (id, buyer_id, vendor_id, product_id) 
    SELECT uuid_generate_v4(), buyer1_id, vendor1_id, p.id
    FROM products p WHERE p.slug = 'samsung-galaxy-s24';

    -- Insert sample messages
    INSERT INTO messages (conversation_id, sender_id, content) 
    SELECT c.id, buyer1_id, 'Hi, is this phone still available?'
    FROM conversations c WHERE c.buyer_id = buyer1_id;

    INSERT INTO messages (conversation_id, sender_id, content) 
    SELECT c.id, vendor1_id, 'Yes, it is! We have it in stock. Would you like to know more about it?'
    FROM conversations c WHERE c.buyer_id = buyer1_id;

    -- Insert sample notifications
    INSERT INTO notifications (user_id, type, title, message) VALUES
        (buyer1_id, 'order_shipped', 'Order Shipped!', 'Your order ORD-001-2025 has been shipped and is on the way.'),
        (vendor1_id, 'new_order', 'New Order Received', 'You have received a new order ORD-001-2025.'),
        (buyer2_id, 'price_drop', 'Price Drop Alert', 'The item in your wishlist "Premium Cotton Jacket" is now on sale!');

END $$;
