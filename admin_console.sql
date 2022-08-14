-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Počítač: 127.0.0.1
-- Vytvořeno: Pon 15. srp 2022, 00:38
-- Verze serveru: 10.4.13-MariaDB
-- Verze PHP: 7.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `admin_console`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `privilege` int(11) NOT NULL,
  `tel` varchar(255) NOT NULL,
  `email` text NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Vypisuji data pro tabulku `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `privilege`, `tel`, `email`, `fname`, `lname`) VALUES
(14, 'tomceman13', '$2y$10$tYJ3tQWqeKO8ZY8dMU1VM.jzmHZ88a3.Rf6uyGCv.vhnriTdg9nwu', 3, '774949174', 'tomceman13@gmail.com', 'Tomáš', 'Zeman'),
(15, 'krek08@vse.cz', '$2y$10$Txk0Fu4vkeK2Ye7N3fEDEeJMxMGcMLiJPoCX91JPVdwTBmADkFPWq', 2, '987654321', 'kit8ty@gmail.com', 'Kristýna', 'Krejčová'),
(16, 'edited1', '$2y$10$rhOEBvJaxgP2Cb5a13YQXOqSTfoNe.wixH1euhQurrX834NCO0Ypi', 1, '333222111', 'edited@seznam.cz', 'Edited', 'Done'),
(17, 'kondicnijizdapraha_cz', '$2y$10$jVy9TkE0AA/XAfSEF0j7guDlsJa1t8w1EeEDFt/ZZUUy1VV/R2zgq', 2, '987654321', 'kok@vse.cz', 'Kok', 'Mok'),
(18, 'Hello', '$2y$10$dyzxSv9iXvznv.9JN/xXce.tsNDxzwnpH4rRt1ctkcgr8.EVbbfIW', 1, '774949174', 'tomceman13@gmail.com', 'Tomáš', 'Zeman');

--
-- Klíče pro exportované tabulky
--

--
-- Klíče pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
