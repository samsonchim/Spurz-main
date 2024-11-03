-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 03, 2024 at 08:55 PM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spurz`
--

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `customer_address` varchar(255) DEFAULT NULL,
  `total_price` varchar(255) DEFAULT NULL,
  `waybill_price` varchar(255) DEFAULT NULL,
  `expected_delivery_date` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `user_id`, `customer_name`, `product_name`, `customer_address`, `total_price`, `waybill_price`, `expected_delivery_date`, `created_at`, `status`, `currency`, `phone_no`, `customer_email`) VALUES
(5, 40000, 'Fred Johnson', 'Wrist Watch', 'No 15 Elder Nnanta close Ogbatai Woji', '9,000', '1,200', '12/09/20238', '2024-10-25 01:57:50', NULL, 'NGN', '09162035539', NULL),
(6, 40000, 'Fred Johnson', 'Wrist Watch', 'No 15 Elder Nnanta close Ogbatai Woji', '4,000', '1,000', '12/09/2023', '2024-10-25 01:59:34', NULL, 'NGN', '09162035539', 'chimaraokesamson@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `outlets`
--

DROP TABLE IF EXISTS `outlets`;
CREATE TABLE IF NOT EXISTS `outlets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `businessType` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `account_no` int DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `phone_no` varchar(15) DEFAULT NULL,
  `business_logo` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=40003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `outlets`
--

INSERT INTO `outlets` (`id`, `businessName`, `email`, `businessType`, `password`, `account_no`, `account_name`, `bank_name`, `phone_no`, `business_logo`, `location`) VALUES
(40000, 'Samson Camp', 'samsonfire@gmail.com', 'Crafts', '$2y$10$FcWE2/26WhlHNafeK.ZuQuQqUUVQXC10CSAiy2e6aWQ0H1glR7Cnu', 2147483647, 'samsonfire@gmail.com', 'Opay', '9162035539', NULL, 'Nationwide'),
(40001, 'BND fashion ', 'ikennaelvis83@gmail.com', 'Fashion', '$2y$10$qL6xfnG3rM2qw7.Wuv1LUuQGp649PYqmetbxPBMayO.bzVhkbOhC6', NULL, NULL, NULL, '0906192242', NULL, 'Nationwide'),
(40002, 'Oma\'s Fashion Hub', 'samsonfire1@gmail.com', 'Fashion', '$2y$10$sm9vT4vZDMPgIYwVfHEaZuhZ4W.Yse6jaNPOhfxvyccUpBS5TL/f6', 9162, 'samsonfire@gmail.com', '', '', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `product_description` varchar(255) NOT NULL,
  `product_category` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `items_in_stock` int NOT NULL,
  `product_type` varchar(50) NOT NULL,
  `meta_tags` varchar(255) NOT NULL,
  `live` bit(1) NOT NULL,
  `promote` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_description`, `product_category`, `price`, `items_in_stock`, `product_type`, `meta_tags`, `live`, `promote`, `user_id`) VALUES
(2007, 'White Hair Cream', 'with a touch of opplp and gley', 'Electronics', 890, 88, 'Retail', 'Fashion, Food', b'0', '', 40000),
(2001, 'Pant ', 'Sharpp pant', 'Fashion', 10000, 10, 'Retail', 'Pant, sharp ', b'0', '', 40001),
(2002, 'ed', 'us', 'Fashion,Digital Products', 6000, 7000, 'Retail', 'canb', b'0', '', 40000),
(2003, 'Ed 222', 'us', 'Home, Fashion', 79978, 7678, 'Retail', 'canb', b'0', '', 40000),
(2004, 'Kiniko', 'us', 'Fashion', 778, 7678, 'Retail', 'canb', b'0', '', 40000);

-- --------------------------------------------------------

--
-- Table structure for table `product_likes`
--

DROP TABLE IF EXISTS `product_likes`;
CREATE TABLE IF NOT EXISTS `product_likes` (
  `product_id` int NOT NULL,
  `likes` int DEFAULT '0',
  `user_id` int NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_likes`
--

INSERT INTO `product_likes` (`product_id`, `likes`, `user_id`, `timestamp`) VALUES
(2000, 2, 40000, '2024-08-23 21:29:55'),
(2004, 1, 40000, '2024-10-30 01:43:28');

-- --------------------------------------------------------

--
-- Table structure for table `product_reviews`
--

DROP TABLE IF EXISTS `product_reviews`;
CREATE TABLE IF NOT EXISTS `product_reviews` (
  `product_id` int NOT NULL,
  `review` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`,`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_reviews`
--

INSERT INTO `product_reviews` (`product_id`, `review`, `user_id`, `username`, `timestamp`) VALUES
(0, 'hy', 1, 'Jerry', '2024-08-29 14:19:24'),
(0, 'this is a very good product', 7, '', '2024-08-29 14:20:07');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `csrf_token` varchar(64) DEFAULT NULL,
  `total_due` decimal(10,2) DEFAULT NULL,
  `currency` varchar(3) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
