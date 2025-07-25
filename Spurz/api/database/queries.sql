-- Useful Queries for Spurz Marketplace Database

-- 1. Get all products with vendor information and category
SELECT 
    p.id,
    p.name,
    p.price,
    p.compare_price,
    p.stock_quantity,
    p.is_featured,
    u.full_name as vendor_name,
    u.email as vendor_email,
    c.name as category_name,
    p.created_at
FROM products p
JOIN users u ON p.vendor_id = u.id
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC;

-- 2. Get product reviews with user information
SELECT 
    r.id,
    r.rating,
    r.title,
    r.comment,
    u.full_name as reviewer_name,
    p.name as product_name,
    r.is_verified_purchase,
    r.created_at
FROM reviews r
JOIN users u ON r.user_id = u.id
JOIN products p ON r.product_id = p.id
WHERE r.is_approved = true
ORDER BY r.created_at DESC;

-- 3. Get order details with items
SELECT 
    o.id as order_id,
    o.order_number,
    o.status,
    o.total_amount,
    u.full_name as customer_name,
    oi.product_name,
    oi.quantity,
    oi.price,
    oi.total as item_total,
    o.created_at
FROM orders o
JOIN users u ON o.customer_id = u.id
JOIN order_items oi ON o.id = oi.order_id
ORDER BY o.created_at DESC;

-- 4. Get vendor sales summary
SELECT 
    u.full_name as vendor_name,
    COUNT(DISTINCT o.id) as total_orders,
    SUM(oi.total) as total_revenue,
    AVG(oi.price) as avg_item_price,
    COUNT(oi.id) as total_items_sold
FROM users u
JOIN order_items oi ON u.id = oi.vendor_id
JOIN orders o ON oi.order_id = o.id
WHERE u.user_type = 'vendor' AND o.status = 'delivered'
GROUP BY u.id, u.full_name
ORDER BY total_revenue DESC;

-- 5. Get most popular products
SELECT 
    p.name,
    p.price,
    COUNT(oi.id) as times_ordered,
    SUM(oi.quantity) as total_quantity_sold,
    AVG(r.rating) as avg_rating,
    COUNT(r.id) as review_count
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id, p.name, p.price
ORDER BY times_ordered DESC, total_quantity_sold DESC;

-- 6. Get user's cart with product details
SELECT 
    ci.id as cart_item_id,
    p.name as product_name,
    p.price,
    ci.quantity,
    (p.price * ci.quantity) as total_price,
    p.stock_quantity,
    u.full_name as vendor_name
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
JOIN users u ON p.vendor_id = u.id
WHERE ci.user_id = $1  -- Replace with actual user ID
ORDER BY ci.created_at DESC;

-- 7. Get chat conversations with last message
SELECT 
    c.id as conversation_id,
    buyer.full_name as buyer_name,
    vendor.full_name as vendor_name,
    p.name as product_name,
    c.last_message_at,
    (
        SELECT m.content 
        FROM messages m 
        WHERE m.conversation_id = c.id 
        ORDER BY m.created_at DESC 
        LIMIT 1
    ) as last_message
FROM conversations c
JOIN users buyer ON c.buyer_id = buyer.id
JOIN users vendor ON c.vendor_id = vendor.id
LEFT JOIN products p ON c.product_id = p.id
ORDER BY c.last_message_at DESC;

-- 8. Get notifications for a user
SELECT 
    n.id,
    n.type,
    n.title,
    n.message,
    n.is_read,
    n.created_at
FROM notifications n
WHERE n.user_id = $1  -- Replace with actual user ID
ORDER BY n.created_at DESC
LIMIT 20;

-- 9. Get product search with filters
SELECT 
    p.id,
    p.name,
    p.price,
    p.compare_price,
    p.short_description,
    p.images,
    p.is_featured,
    u.full_name as vendor_name,
    c.name as category_name,
    AVG(r.rating) as avg_rating,
    COUNT(r.id) as review_count
FROM products p
JOIN users u ON p.vendor_id = u.id
JOIN categories c ON p.category_id = c.id
LEFT JOIN reviews r ON p.id = r.product_id
WHERE p.is_active = true
    AND ($1 IS NULL OR p.name ILIKE '%' || $1 || '%')  -- Search term
    AND ($2 IS NULL OR c.id = $2)  -- Category filter
    AND ($3 IS NULL OR p.price <= $3)  -- Max price filter
    AND ($4 IS NULL OR p.price >= $4)  -- Min price filter
GROUP BY p.id, p.name, p.price, p.compare_price, p.short_description, p.images, p.is_featured, u.full_name, c.name
ORDER BY 
    CASE WHEN $5 = 'price_asc' THEN p.price END ASC,
    CASE WHEN $5 = 'price_desc' THEN p.price END DESC,
    CASE WHEN $5 = 'rating' THEN AVG(r.rating) END DESC NULLS LAST,
    CASE WHEN $5 = 'newest' THEN p.created_at END DESC,
    p.is_featured DESC, p.created_at DESC;

-- 10. Get daily sales report
SELECT 
    DATE(o.created_at) as sale_date,
    COUNT(o.id) as total_orders,
    SUM(o.total_amount) as total_revenue,
    AVG(o.total_amount) as avg_order_value,
    COUNT(DISTINCT o.customer_id) as unique_customers
FROM orders o
WHERE o.status = 'delivered'
    AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(o.created_at)
ORDER BY sale_date DESC;

-- 11. Get low stock products
SELECT 
    p.name,
    p.stock_quantity,
    p.sku,
    u.full_name as vendor_name,
    u.email as vendor_email,
    c.name as category_name
FROM products p
JOIN users u ON p.vendor_id = u.id
JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true 
    AND p.stock_quantity <= 10  -- Low stock threshold
ORDER BY p.stock_quantity ASC, p.name;

-- 12. Get user activity summary
SELECT 
    u.full_name,
    u.email,
    u.user_type,
    COUNT(DISTINCT CASE WHEN u.user_type = 'buyer' THEN o.id END) as orders_placed,
    COUNT(DISTINCT CASE WHEN u.user_type = 'vendor' THEN p.id END) as products_listed,
    COUNT(DISTINCT r.id) as reviews_written,
    COUNT(DISTINCT f.id) as favorites_count,
    u.created_at as joined_date
FROM users u
LEFT JOIN orders o ON u.id = o.customer_id
LEFT JOIN products p ON u.id = p.vendor_id
LEFT JOIN reviews r ON u.id = r.user_id
LEFT JOIN favorites f ON u.id = f.user_id
WHERE u.is_active = true
GROUP BY u.id, u.full_name, u.email, u.user_type, u.created_at
ORDER BY u.created_at DESC;
