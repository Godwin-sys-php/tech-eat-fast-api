-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : ven. 19 fév. 2021 à 12:51
-- Version du serveur :  5.7.32
-- Version de PHP : 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Base de données : `whatthefood`
--

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
(1, 1, 'PizzaInn', 'pizzaInn.com', 'Là-bas', 'http://192.168.1.187:4200/Images-Resto/1.1613305364388.png', 'Super restaurant, venez nous donner du cash !!!', 1612878535, 0);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`idRestaurant`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `address` (`address`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `idRestaurant` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
