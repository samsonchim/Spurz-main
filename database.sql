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
    product_description VARCHAR (255) NOT NULL,
    product_category VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    items_in_stock INT NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    meta_tags VARCHAR (255) NOT NULL.
    live BIT NOT NULL,
    promote VARCHAR(255) NOT NULL,
    user_id INT NOT NULL
);

-- Set the starting value for the AUTO_INCREMENT column
ALTER TABLE products AUTO_INCREMENT = 2000;


ALTER TABLE outlets
ADD COLUMN account_no INT (20),
ADD COLUMN account_name VARCHAR (255),
ADD COLUMN bank_name VARCHAR (255),
ADD COLUMN phone_no VARCHAR(15),
ADD COLUMN business_logo VARCHAR(255),
ADD COLUMN location VARCHAR(255);
