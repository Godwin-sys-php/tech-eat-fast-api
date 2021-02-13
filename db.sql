-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : sam. 13 fév. 2021 à 22:01
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
  `nameOfDish` varchar(100) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Structure de la table `commands`
--

CREATE TABLE `commands` (
  `idCommand` int(11) NOT NULL,
  `idRestaurant` int(11) NOT NULL,
  `idDeliverer` int(11) DEFAULT NULL,
  `idUser` int(11) NOT NULL,
  `orderId` varchar(100) NOT NULL,
  `nameOfClient` varchar(100) NOT NULL,
  `emailOfClient` varchar(200) DEFAULT NULL,
  `phoneNumberOfClient` mediumint(9) DEFAULT NULL,
  `address` varchar(300) NOT NULL,
  `comment` varchar(300) NOT NULL,
  `type` varchar(50) NOT NULL,
  `creationDate` int(100) NOT NULL,
  `lastUpdate` mediumint(9) NOT NULL,
  `total` int(11) NOT NULL,
  `paymentMethod` varchar(50) NOT NULL,
  `accept` varchar(50) NOT NULL,
  `whyRefused` varchar(50) DEFAULT NULL,
  `canRetry` tinyint(1) DEFAULT NULL,
  `status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
(2, 1, 'Menu 2', 1613251691);

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

INSERT INTO `restaurants` (`idRestaurant`, `name`, `website`, `address`, `logoUrl`, `description`, `creationDate`, `acceptCash`) VALUES
(1, 'PizzaInn', 'pizzaInn.com', 'Là-bas', 'http://localhost:4200/Images-Resto/1.1613251487915.png', 'Super restaurant, venez nous donner du cash !!!', 1612878535, 0);

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
(1, 1, 'Godwin Burume', 'godwinnyembo@gmail.com', 1612878535, '$2b$10$o4/x/1UXZfuCGMpvDGa95uxRpEZ5K1WCusTif8UReFu9rG5WXCOFa', 'http://localhost:4200/PDP_Resto/default.jpg', 3);

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
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`idUser`),
  ADD UNIQUE KEY `password` (`password`);

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
  MODIFY `idCommandItem` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `commands`
--
ALTER TABLE `commands`
  MODIFY `idCommand` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `deliverers`
--
ALTER TABLE `deliverers`
  MODIFY `idDeliverer` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `dishes`
--
ALTER TABLE `dishes`
  MODIFY `idDish` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `menus`
--
ALTER TABLE `menus`
  MODIFY `idMenu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `usersRestaurant`
--
ALTER TABLE `usersRestaurant`
  MODIFY `idUserRestaurant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
