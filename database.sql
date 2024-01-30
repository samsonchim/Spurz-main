CREATE TABLE IF NOT EXISTS outlets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    businessName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    businessType VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
)AUTO_INCREMENT = 40000;

CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_category VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    items_in_stock INT NOT NULL,
    product_type VARCHAR(50) NOT NULL
);

-- Set the starting value for the AUTO_INCREMENT column
ALTER TABLE products AUTO_INCREMENT = 2000;
