-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 04, 2021 at 02:25 PM
-- Server version: 10.4.18-MariaDB-log
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_hinga`
--

-- --------------------------------------------------------

--
-- Table structure for table `Bills`
--

CREATE TABLE `Bills` (
  `bill_ID` int(11) NOT NULL,
  `amount` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Bills`
--

INSERT INTO `Bills` (`bill_ID`, `amount`) VALUES
(1, '5.00'),
(2, '5.00'),
(3, '20.00');

-- --------------------------------------------------------

--
-- Table structure for table `Customers`
--

CREATE TABLE `Customers` (
  `customer_ID` int(11) NOT NULL,
  `reward_ID` int(11) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Customers`
--

INSERT INTO `Customers` (`customer_ID`, `reward_ID`, `first_name`, `last_name`, `email`) VALUES
(1, NULL, 'Randy', 'Couture', 'randyC@ufc.com'),
(2, NULL, 'Dana', 'White', 'danawhite@ufc.com'),
(3, NULL, 'Chuck', 'Norris', 'cNorris@yahoo.com');

-- --------------------------------------------------------

--
-- Table structure for table `ItemBills`
--

CREATE TABLE `ItemBills` (
  `ib_ID` int(11) NOT NULL,
  `bill_ID` int(11) NOT NULL,
  `item_ID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ItemBills`
--

INSERT INTO `ItemBills` (`ib_ID`, `bill_ID`, `item_ID`, `quantity`) VALUES
(1, 1, 3, 1),
(2, 1, 3, 1),
(3, 1, 1, 1),
(4, 2, 2, 5);

-- --------------------------------------------------------

--
-- Table structure for table `Items`
--

CREATE TABLE `Items` (
  `item_ID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(6,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Items`
--

INSERT INTO `Items` (`item_ID`, `name`, `price`) VALUES
(1, 'Fries', '2.00'),
(2, 'Hamburger', '4.00'),
(3, 'Pepsi', '1.50');

-- --------------------------------------------------------

--
-- Table structure for table `Orders`
--

CREATE TABLE `Orders` (
  `order_ID` int(11) NOT NULL,
  `customer_ID` int(11) NOT NULL,
  `bill_ID` int(11) NOT NULL,
  `reward_used` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Orders`
--

INSERT INTO `Orders` (`order_ID`, `customer_ID`, `bill_ID`, `reward_used`) VALUES
(1, 1, 1, 0),
(2, 2, 1, 0),
(3, 3, 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Rewards`
--

CREATE TABLE `Rewards` (
  `reward_ID` int(11) NOT NULL,
  `reward_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Rewards`
--

INSERT INTO `Rewards` (`reward_ID`, `reward_name`, `description`) VALUES
(1, '$10 OFF', '10 OFF'),
(2, '$5 OFF', ' 5 OFF'),
(3, '20% OFF', '20% OFF ORDER');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Bills`
--
ALTER TABLE `Bills`
  ADD PRIMARY KEY (`bill_ID`);

--
-- Indexes for table `Customers`
--
ALTER TABLE `Customers`
  ADD PRIMARY KEY (`customer_ID`),
  ADD UNIQUE KEY `full_name` (`customer_ID`,`first_name`,`last_name`),
  ADD KEY `reward_ID` (`reward_ID`);

--
-- Indexes for table `ItemBills`
--
ALTER TABLE `ItemBills`
  ADD PRIMARY KEY (`ib_ID`),
  ADD KEY `bill_ID` (`bill_ID`),
  ADD KEY `item_ID` (`item_ID`);

--
-- Indexes for table `Items`
--
ALTER TABLE `Items`
  ADD PRIMARY KEY (`item_ID`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`order_ID`),
  ADD KEY `customer_ID` (`customer_ID`),
  ADD KEY `bill_ID` (`bill_ID`);

--
-- Indexes for table `Rewards`
--
ALTER TABLE `Rewards`
  ADD PRIMARY KEY (`reward_ID`),
  ADD UNIQUE KEY `reward_name` (`reward_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Bills`
--
ALTER TABLE `Bills`
  MODIFY `bill_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Customers`
--
ALTER TABLE `Customers`
  MODIFY `customer_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ItemBills`
--
ALTER TABLE `ItemBills`
  MODIFY `ib_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Items`
--
ALTER TABLE `Items`
  MODIFY `item_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Orders`
--
ALTER TABLE `Orders`
  MODIFY `order_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Rewards`
--
ALTER TABLE `Rewards`
  MODIFY `reward_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Customers`
--
ALTER TABLE `Customers`
  ADD CONSTRAINT `Customers_ibfk_1` FOREIGN KEY (`reward_ID`) REFERENCES `Rewards` (`reward_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `ItemBills`
--
ALTER TABLE `ItemBills`
  ADD CONSTRAINT `ItemBills_ibfk_1` FOREIGN KEY (`bill_ID`) REFERENCES `Bills` (`bill_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `ItemBills_ibfk_2` FOREIGN KEY (`item_ID`) REFERENCES `Items` (`item_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `Orders_ibfk_1` FOREIGN KEY (`customer_ID`) REFERENCES `Customers` (`customer_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_ibfk_2` FOREIGN KEY (`bill_ID`) REFERENCES `Bills` (`bill_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
