-- StyleHub Database Schema

CREATE DATABASE IF NOT EXISTS stylehub_db;
USE stylehub_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('men', 'women', 'accessories') NOT NULL,
    image VARCHAR(500) DEFAULT '/placeholder.svg?height=300&width=300',
    featured BOOLEAN DEFAULT FALSE,
    status ENUM('active', 'inactive', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (first_name, last_name, email, password, role) VALUES 
('Admin', 'User', 'admin@stylehub.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- Password is 'password'

-- Insert sample products
INSERT INTO products (name, description, price, category, featured) VALUES 
('Classic White T-Shirt', 'Premium cotton t-shirt perfect for everyday wear', 29.99, 'men', TRUE),
('Elegant Black Dress', 'Sophisticated black dress for special occasions', 89.99, 'women', TRUE),
('Leather Wallet', 'Genuine leather wallet with multiple card slots', 49.99, 'accessories', FALSE),
('Denim Jacket', 'Classic denim jacket with modern fit', 79.99, 'men', TRUE),
('Summer Floral Dress', 'Light and breezy dress perfect for summer', 59.99, 'women', FALSE),
('Designer Sunglasses', 'UV protection sunglasses with stylish frame', 129.99, 'accessories', TRUE);
