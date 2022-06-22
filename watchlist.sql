-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Gegenereerd op: 06 apr 2022 om 19:03
-- Serverversie: 10.4.21-MariaDB
-- PHP-versie: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `watchlist`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tb_reviews`
--

CREATE TABLE `tb_reviews` (
  `id` int(32) NOT NULL,
  `album_id` varchar(64) NOT NULL,
  `user_name` varchar(32) NOT NULL,
  `user_id` varchar(32) NOT NULL,
  `text` varchar(256) NOT NULL,
  `album_name` varchar(128) NOT NULL,
  `album_image` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `tb_reviews`
--

INSERT INTO `tb_reviews` (`id`, `album_id`, `user_name`, `user_id`, `text`, `album_name`, `album_image`) VALUES
(2, '5XzJ5ly0AruIMnH5L0dXsj', 'Rik', '1158572249', 'heyy', 'asdad', 'https://i.scdn.co/image/ab67616d00001e028b20e4631fa15d3953528bbc'),
(3, '3hHmYc6mrl6NkmRW1ZwYvm', 'Rik', '1158572249', 'lololo', 'naam van album', 'https://i.scdn.co/image/ab67616d00001e02f2149422121d1674c6f4c009');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tb_users`
--

CREATE TABLE `tb_users` (
  `id` int(16) NOT NULL,
  `user_id` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `tb_users`
--

INSERT INTO `tb_users` (`id`, `user_id`) VALUES
(4, '1158572249');

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `tb_watchlist`
--

CREATE TABLE `tb_watchlist` (
  `id` int(32) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `album_id` varchar(64) NOT NULL,
  `watched` tinyint(1) NOT NULL,
  `time_added` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Gegevens worden geëxporteerd voor tabel `tb_watchlist`
--

INSERT INTO `tb_watchlist` (`id`, `user_id`, `album_id`, `watched`, `time_added`) VALUES
(120, '1158572249', '19WOpWF2LlCJslarLZE874', 0, '2022-04-06'),
(140, '1158572249', '57AJ70IWVE0pmPwNYBa4PT', 0, '2022-04-06');

--
-- Indexen voor geëxporteerde tabellen
--

--
-- Indexen voor tabel `tb_reviews`
--
ALTER TABLE `tb_reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id`);

--
-- Indexen voor tabel `tb_watchlist`
--
ALTER TABLE `tb_watchlist`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT voor geëxporteerde tabellen
--

--
-- AUTO_INCREMENT voor een tabel `tb_reviews`
--
ALTER TABLE `tb_reviews`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT voor een tabel `tb_users`
--
ALTER TABLE `tb_users`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT voor een tabel `tb_watchlist`
--
ALTER TABLE `tb_watchlist`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
