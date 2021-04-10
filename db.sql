-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : sam. 10 avr. 2021 à 08:41
-- Version du serveur :  5.7.32
-- Version de PHP : 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données : `whatthefood`
--

-- --------------------------------------------------------

--
-- Structure de la table `commandItems`
--

CREATE TABLE `commandItems` (
  `idCommandItem` int(11) NOT NULL,
  `idCommand` int(11) NOT NULL,
  `idDish` int(11) NOT NULL,
  `idOption` int(11) DEFAULT NULL,
  `nameOfDish` varchar(100) NOT NULL,
  `nameOfOption` varchar(100) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `quantity` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `commandItems`
--

INSERT INTO `commandItems` (`idCommandItem`, `idCommand`, `idDish`, `idOption`, `nameOfDish`, `nameOfOption`, `price`, `quantity`) VALUES
(1, 1, 2, NULL, '4 saisons', NULL, 25000, 2),
(2, 1, 8, NULL, 'Pepsi', NULL, 1400, 8),
(3, 2, 2, NULL, '4 saisons', NULL, 25000, 3),
(4, 3, 2, NULL, '4 saisons', NULL, 25000, 2),
(5, 4, 2, NULL, '4 saisons', NULL, 25000, 2),
(6, 5, 2, NULL, '4 saisons', NULL, 25000, 2),
(7, 6, 2, NULL, '4 saisons', NULL, 25000, 2),
(8, 7, 2, NULL, '4 saisons', NULL, 25000, 2),
(9, 8, 2, NULL, '4 saisons', NULL, 25000, 2),
(10, 9, 2, NULL, '4 saisons', NULL, 25000, 2),
(11, 10, 2, NULL, '4 saisons', NULL, 25000, 2),
(12, 11, 2, NULL, '4 saisons', NULL, 25000, 2),
(13, 12, 2, NULL, '4 saisons', NULL, 25000, 5),
(14, 13, 2, NULL, '4 saisons', NULL, 25000, 2),
(15, 14, 2, NULL, '4 saisons', NULL, 25000, 2),
(16, 15, 4, NULL, 'Primaverra', NULL, 12000, 2);

-- --------------------------------------------------------

--
-- Structure de la table `commands`
--

CREATE TABLE `commands` (
  `idCommand` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `idUser` int(11) DEFAULT NULL,
  `deviceId` varchar(100) DEFAULT NULL,
  `orderId` varchar(100) NOT NULL,
  `nameOfClient` varchar(100) NOT NULL,
  `emailOfClient` varchar(200) DEFAULT NULL,
  `phoneNumberOfClient` double DEFAULT NULL,
  `address` varchar(300) DEFAULT NULL,
  `comment` varchar(300) NOT NULL,
  `type` varchar(50) NOT NULL,
  `invoiceUrl` varchar(100) DEFAULT NULL,
  `creationDate` int(100) NOT NULL,
  `lastUpdate` double NOT NULL,
  `total` int(11) NOT NULL,
  `paymentMethod` varchar(50) NOT NULL,
  `accept` tinyint(1) DEFAULT NULL,
  `whyRefused` varchar(70) DEFAULT NULL,
  `status` varchar(50) NOT NULL COMMENT 'inLoading, inCooking, outOfRestaurant, ready, done'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `commands`
--

INSERT INTO `commands` (`idCommand`, `idRestaurant`, `idUser`, `deviceId`, `orderId`, `nameOfClient`, `emailOfClient`, `phoneNumberOfClient`, `address`, `comment`, `type`, `invoiceUrl`, `creationDate`, `lastUpdate`, `total`, `paymentMethod`, `accept`, `whyRefused`, `status`) VALUES
(1, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '729883bd-a108-4570-947c-591912e31e23', 'Godwin Burume', NULL, 2436545433, 'Mon adresse', 'Faites vite', 'toDelive', 'http://localhost:4200/Invoices/Facture_1_Godwin Burume.pdf', 1617801933, 1617802042, 61200, 'CB', 1, NULL, 'outOfRestaurant'),
(2, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '7bf76b8e-fa17-48d6-8174-244bdf140c35', 'Godwin Burume', NULL, 243, 'Mon adresse', 'LOLCAT', 'toDelive', 'http://localhost:4200/Invoices/Facture_1_Godwin Burume.pdf', 1617882150, 1617882177, 75000, 'CB', 1, NULL, 'outOfRestaurant'),
(3, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '26d1dd53-d6f3-4f0c-a971-4afa445119a0', 'Godwin Burume', NULL, 243, 'Mon adresse', 'LOLCAT', 'toDelive', 'http://localhost:4200/Invoices/Facture_1_Godwin Burume.pdf', 1617882279, 1617882285, 50000, 'CB', 1, NULL, 'outOfRestaurant'),
(4, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '182fa10a-cc0b-4727-b4c0-766b6a1879f4', 'Godwin Burume', NULL, 243756432465, 'Mon adresse', 'LOLCAT', 'toDelive', 'http://localhost:4200/Invoices/Facture_5_Godwin Burume.pdf', 1617882743, 1617882751, 50000, 'CB', 1, NULL, 'outOfRestaurant'),
(5, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '11bc2f8f-9ef6-44da-a963-30d95961ad76', 'Godwin Burume', NULL, 243, 'Mon adresse', 'LOLCAT', 'toDelive', 'http://localhost:4200/Invoices/Facture_6_Godwin Burume.pdf', 1617882837, 1617882854, 50000, 'm-pesa', 1, NULL, 'outOfRestaurant'),
(6, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', 'a93dee17-bca4-4b1b-897b-990b1dcdd227', 'Godwin', NULL, 243, 'Mon adresse', 'FDSFSdfsdfsdfsdfdsfsdf', 'toDelive', 'http://localhost:4200/Invoices/Facture_7_Godwin.pdf', 1617883433, 1617883441, 50000, 'CB', 1, NULL, 'outOfRestaurant'),
(7, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '49d02ade-0455-4763-b6bd-4612fbcb6abb', 'Godwin Burume', NULL, 24354324354, 'MON ADRESSE', 'Bfhdbhdb', 'toDelive', 'http://localhost:4200/Invoices/Facture_8_Godwin Burume.pdf', 1617885687, 1617885695, 50000, 'CB', 1, NULL, 'outOfRestaurant'),
(8, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '0d09d380-28d5-4e68-b148-1ab371665622', 'Godwin Burume', NULL, 243, 'Mon adresse', 'LOLCAT', 'toDelive', NULL, 1618026689, 1618026689, 50000, 'CB', NULL, NULL, 'inLoading'),
(9, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '5946f185-3194-47cb-bc7c-1b31b0f63ae4', 'Godwin', NULL, 243, 'Mon adresse', '', 'toDelive', NULL, 1618036371, 1618036371, 50000, 'CB', NULL, NULL, 'inLoading'),
(10, 1, 2, NULL, 'd656d4f8-2d17-4593-bc48-6a361b58dbe5', 'Godwin Burume', 'godwin.burume@gmail.com', 243, 'ICIccs', '', 'toDelive', NULL, 1618036506, 1618036591, 50000, 'CB', 1, NULL, 'inCooking'),
(11, 1, 2, NULL, '052f99e3-1a85-44b6-8757-4cae8fec0e7f', 'Godwin Burume', 'godwin.burume@gmail.com', 243, 'LOLCATFDFD', 'LOLCAFDFSD', 'toDelive', NULL, 1618036662, 1618036707, 50000, 'CB', 1, 'Adresse invalide', 'done'),
(12, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', 'fec74851-ec10-4897-99d6-4fba8b7c177a', 'Godwin Burume', NULL, 243, 'Mon adresse', 'LOLCAT', 'toDelive', NULL, 1618037661, 1618037661, 125000, 'CB', NULL, NULL, 'inLoading'),
(13, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '00ba6ece-cdac-4756-aacb-205ba4a53344', 'Fdfdf', NULL, 243, 'Dfdfdf', 'Dfdfdf', 'toDelive', NULL, 1618038032, 1618038032, 50000, 'CB', NULL, NULL, 'inLoading'),
(14, 1, NULL, 'AC622230-972C-4F6E-88BB-ECC1F26E5BA1', '158b5a27-83a2-4ed1-92a9-f9ecd0c5308f', 'Fdfdfdfdf', NULL, 243, 'Fdfdfdfd', 'Fdfdfdf', 'toDelive', NULL, 1618038124, 1618038124, 50000, 'CB', NULL, NULL, 'inLoading'),
(15, 1, 2, NULL, 'a72dc7bb-41c4-4062-ab9d-96f0dbc5151e', 'Godwin Burume', 'godwin.burume@gmail.com', 243, 'Fdfdfdfdfd', 'Fdfd', 'toDelive', NULL, 1618041466, 1618041466, 24000, 'cash', NULL, NULL, 'inLoading');

-- --------------------------------------------------------

--
-- Structure de la table `deliverers`
--

CREATE TABLE `deliverers` (
  `idDeliverer` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `name` varchar(75) NOT NULL,
  `pdpUrl` varchar(75) NOT NULL,
  `creationDate` int(100) NOT NULL,
  `phoneNumber` mediumint(9) NOT NULL,
  `numbePlate` varchar(30) NOT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `dishes`
--

CREATE TABLE `dishes` (
  `idDish` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `idMenu` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `description` varchar(400) NOT NULL,
  `price` int(11) NOT NULL,
  `creationDate` int(100) NOT NULL,
  `imageUrl` varchar(100) DEFAULT NULL,
  `available` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `dishes`
--

INSERT INTO `dishes` (`idDish`, `idRestaurant`, `idMenu`, `name`, `description`, `price`, `creationDate`, `imageUrl`, `available`) VALUES
(2, 1, 2, '4 saisons', '4 saisons, 4 Fromage :D', 25000, 1613730603, 'http://localhost:4200/Images-Dishes/4s.jpg_1613730603589.jpg', 1),
(3, 1, 2, 'Margherita', 'Un classique', 19000, 1613735109, 'http://localhost:4200/Images-Dishes/p.jpeg_1613735109705.jpg', 1),
(4, 1, 2, 'Primaverra', 'Pizza très économique', 12000, 1613735150, 'http://localhost:4200/Images-Dishes/primaverra.jpg_1613735150160.jpg', 1),
(5, 1, 2, 'Spécial Apple', 'Très chère parce qu\'il y a un nom à 10000$ dessus ^^', 65000, 1613735221, 'http://localhost:4200/Images-Dishes/pizza_parma.png_1613735221785.png', 1),
(6, 1, 3, 'Coca-Cola', 'En canette', 1500, 1613736145, 'http://localhost:4200/Images-Dishes/cc.jpg_1613736145124.jpg', 1),
(7, 1, 3, 'Fanta', 'En canette', 1450, 1613736165, 'http://localhost:4200/Images-Dishes/fanta.jpg_1613736165549.jpg', 1),
(8, 1, 3, 'Pepsi', 'En canette', 1400, 1613736186, 'http://localhost:4200/Images-Dishes/pepsi.jpg_1613736186995.jpg', 1),
(9, 1, 3, 'Sprite', 'En canette', 1350, 1613736230, 'http://localhost:4200/Images-Dishes/sprite.jpg_1613736230625.jpg', 1),
(11, 1, 4, 'Ketchup', 'Heinz', 1000, 1613736609, 'http://localhost:4200/Images-Dishes/heinz.jpg_1613736609744.jpg', 1),
(12, 1, 4, 'Supplément de fromage', 'Du parmesan', 2000, 1613736659, 'http://localhost:4200/Images-Dishes/fromage.jpg_1613736659466.jpg', 1),
(13, 1, 4, 'Mayonnaise', 'Mayp', 1500, 1613736685, 'http://localhost:4200/Images-Dishes/mayo.jpg_1613736685809.jpg', 1),
(14, 1, 4, 'Sauce à pizza', 'Stephan Pizza', 5000, 1613736714, 'http://localhost:4200/Images-Dishes/sauce à pizza.jpg_1613736714400.jpg', 1);

-- --------------------------------------------------------

--
-- Structure de la table `dishOptions`
--

CREATE TABLE `dishOptions` (
  `idDishOption` int(11) NOT NULL,
  `idDish` int(11) NOT NULL,
  `name` varchar(70) NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `dishOptions`
--

INSERT INTO `dishOptions` (`idDishOption`, `idDish`, `name`, `price`) VALUES
(1, 21, 'Options 1', 1500),
(2, 22, 'Options 1', 1500),
(3, 23, 'Options 1', 1500),
(4, 23, 'Options 2', 1500),
(17, 2, 'Avec plus de fromage', 30000);

-- --------------------------------------------------------

--
-- Structure de la table `menus`
--

CREATE TABLE `menus` (
  `idMenu` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `creationDate` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `menus`
--

INSERT INTO `menus` (`idMenu`, `idRestaurant`, `name`, `creationDate`) VALUES
(2, 1, 'Pizza2', 1613251691),
(3, 1, 'Boissons', 1613730478),
(4, 1, 'Supplément', 1613730486);

-- --------------------------------------------------------

--
-- Structure de la table `PaymentMethodRestaurant`
--

CREATE TABLE `PaymentMethodRestaurant` (
  `idPaymentMethod` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `PaymentMethodRestaurant`
--

INSERT INTO `PaymentMethodRestaurant` (`idPaymentMethod`, `idRestaurant`, `name`) VALUES
(1, 1, 'm-pesa'),
(2, 1, 'CB'),
(3, 1, 'airtel-money');

-- --------------------------------------------------------

--
-- Structure de la table `restaurants`
--

CREATE TABLE `restaurants` (
  `idRestaurant` int(11) NOT NULL,
  `idType` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `website` varchar(300) DEFAULT NULL,
  `address` varchar(300) NOT NULL,
  `logoUrl` varchar(300) NOT NULL,
  `description` varchar(300) NOT NULL,
  `creationDate` int(100) NOT NULL,
  `acceptCash` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `restaurants`
--

INSERT INTO `restaurants` (`idRestaurant`, `idType`, `name`, `website`, `address`, `logoUrl`, `description`, `creationDate`, `acceptCash`) VALUES
(1, 1, 'PizzaInn', 'pizzaInn.com', 'Ici', 'http://localhost:4200/Images-Resto/1.1617801780396.png', 'Super restaurant !!!', 1612878535, 1);

-- --------------------------------------------------------

--
-- Structure de la table `restaurantsType`
--

CREATE TABLE `restaurantsType` (
  `idType` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `color` varchar(40) NOT NULL,
  `colorText` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `restaurantsType`
--

INSERT INTO `restaurantsType` (`idType`, `name`, `color`, `colorText`) VALUES
(1, 'Pizzeria', '#28a745', '#ffffff');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `idUser` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `pseudo` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `creationDate` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`idUser`, `name`, `email`, `pseudo`, `password`, `creationDate`) VALUES
(2, 'Godwin Burume', 'godwin.burume@gmail.com', 'nodewin', '$2b$10$k16uXULCfFBypBZY2lgpSOtdEvYo6h/Dt2u0C9k8.U7fjq3OUVRr.', 1615874040);

-- --------------------------------------------------------

--
-- Structure de la table `usersAddress`
--

CREATE TABLE `usersAddress` (
  `idUserAdress` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `address` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `usersAddress`
--

INSERT INTO `usersAddress` (`idUserAdress`, `idUser`, `address`) VALUES
(2, 1, 'Avenue des Palmiers'),
(9, 1, 'Une adresse'),
(11, 2, 'Adresse 2'),
(12, 2, 'Mimoza');

-- --------------------------------------------------------

--
-- Structure de la table `usersPhoneNumber`
--

CREATE TABLE `usersPhoneNumber` (
  `idUserPhoneNumber` int(11) NOT NULL,
  `idUser` int(11) NOT NULL,
  `phoneNumber` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `usersPhoneNumber`
--

INSERT INTO `usersPhoneNumber` (`idUserPhoneNumber`, `idUser`, `phoneNumber`) VALUES
(2, 1, 243815461960),
(3, 2, 243815461960);

-- --------------------------------------------------------

--
-- Structure de la table `usersRestaurant`
--

CREATE TABLE `usersRestaurant` (
  `idUserRestaurant` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `name` varchar(300) NOT NULL,
  `email` varchar(300) NOT NULL,
  `creationDate` int(100) NOT NULL,
  `password` varchar(300) NOT NULL,
  `pdpUrl` varchar(300) NOT NULL,
  `level` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `usersRestaurant`
--

INSERT INTO `usersRestaurant` (`idUserRestaurant`, `idRestaurant`, `name`, `email`, `creationDate`, `password`, `pdpUrl`, `level`) VALUES
(1, 1, 'Godwin Burume', 'admin@pizzainn.com', 1612878535, '$2b$10$o4/x/1UXZfuCGMpvDGa95uxRpEZ5K1WCusTif8UReFu9rG5WXCOFa', 'http://localhost:4200/PDP_Resto/default.jpg', 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `commandItems`
--
ALTER TABLE `commandItems`
  ADD PRIMARY KEY (`idCommandItem`);

--
-- Index pour la table `commands`
--
ALTER TABLE `commands`
  ADD PRIMARY KEY (`idCommand`);

--
-- Index pour la table `deliverers`
--
ALTER TABLE `deliverers`
  ADD PRIMARY KEY (`idDeliverer`);

--
-- Index pour la table `dishes`
--
ALTER TABLE `dishes`
  ADD PRIMARY KEY (`idDish`);

--
-- Index pour la table `dishOptions`
--
ALTER TABLE `dishOptions`
  ADD PRIMARY KEY (`idDishOption`);

--
-- Index pour la table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`idMenu`);

--
-- Index pour la table `PaymentMethodRestaurant`
--
ALTER TABLE `PaymentMethodRestaurant`
  ADD PRIMARY KEY (`idPaymentMethod`);

--
-- Index pour la table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`idRestaurant`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `address` (`address`);

--
-- Index pour la table `restaurantsType`
--
ALTER TABLE `restaurantsType`
  ADD PRIMARY KEY (`idType`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `password` (`password`);

--
-- Index pour la table `usersAddress`
--
ALTER TABLE `usersAddress`
  ADD PRIMARY KEY (`idUserAdress`);

--
-- Index pour la table `usersPhoneNumber`
--
ALTER TABLE `usersPhoneNumber`
  ADD PRIMARY KEY (`idUserPhoneNumber`);

--
-- Index pour la table `usersRestaurant`
--
ALTER TABLE `usersRestaurant`
  ADD PRIMARY KEY (`idUserRestaurant`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `commandItems`
--
ALTER TABLE `commandItems`
  MODIFY `idCommandItem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `commands`
--
ALTER TABLE `commands`
  MODIFY `idCommand` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `deliverers`
--
ALTER TABLE `deliverers`
  MODIFY `idDeliverer` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `dishes`
--
ALTER TABLE `dishes`
  MODIFY `idDish` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `dishOptions`
--
ALTER TABLE `dishOptions`
  MODIFY `idDishOption` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `menus`
--
ALTER TABLE `menus`
  MODIFY `idMenu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `PaymentMethodRestaurant`
--
ALTER TABLE `PaymentMethodRestaurant`
  MODIFY `idPaymentMethod` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `idRestaurant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `restaurantsType`
--
ALTER TABLE `restaurantsType`
  MODIFY `idType` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `usersAddress`
--
ALTER TABLE `usersAddress`
  MODIFY `idUserAdress` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `usersPhoneNumber`
--
ALTER TABLE `usersPhoneNumber`
  MODIFY `idUserPhoneNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `usersRestaurant`
--
ALTER TABLE `usersRestaurant`
  MODIFY `idUserRestaurant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
