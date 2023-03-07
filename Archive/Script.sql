-- Supression de la base de donnée si elle existe
DROP DATABASE IF EXISTS `screen_maze_db`;

-- Création de la base de donnée si elle n'existe pas
CREATE DATABASE IF NOT EXISTS `screen_maze_db`;

-- Selection de la base de donnée
USE `screen_maze_db`;

-- Création de toutes les tables
CREATE TABLE users(
   id_user INT AUTO_INCREMENT NOT NULL,
   firstname VARCHAR(45),
   lastname VARCHAR(45),
   email VARCHAR(45) NOT NULL,
   password VARCHAR(255) NOT NULL,
   image_user VARCHAR(100) DEFAULT "default_icon.png",
   username VARCHAR(45) NOT NULL,
   is_admin TINYINT NOT NULL DEFAULT 0,
   is_ban TINYINT NOT NULL DEFAULT 0,
   is_verified TINYINT NOT NULL DEFAULT 0,
   recovery INT,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY(id_user),
   UNIQUE(email),
   UNIQUE(username)
);

CREATE TABLE articles(
   id_article INT NOT NULL,
   title VARCHAR(255) NOT NULL,
   release_date DATE NOT NULL,
   overview TEXT NOT NULL,
   poster_path VARCHAR(255) NOT NULL,
   type VARCHAR(45) NOT NULL,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_user INT NOT NULL DEFAULT 1,
   PRIMARY KEY(id_article),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE comments(
   id_comment INT AUTO_INCREMENT NOT NULL,
   content TEXT NOT NULL,
   is_reported TINYINT NOT NULL DEFAULT 0,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_article INT NOT NULL,
   id_user INT NOT NULL,
   PRIMARY KEY(id_comment),
   FOREIGN KEY(id_article) REFERENCES articles(id_article) ON DELETE CASCADE,
   FOREIGN KEY(id_user) REFERENCES users(id_user) ON DELETE CASCADE
);

CREATE TABLE genres(
   id_genre INT NOT NULL,
   name VARCHAR(45) NOT NULL,
   PRIMARY KEY(id_genre)
);

-- Table de liaison
CREATE TABLE articles_genres(
   id_article INT NOT NULL,
   id_genre INT NOT NULL,
   PRIMARY KEY(id_article, id_genre),
   FOREIGN KEY(id_article) REFERENCES articles(id_article) ON DELETE CASCADE,
   FOREIGN KEY(id_genre) REFERENCES genres(id_genre) ON DELETE CASCADE
);

CREATE TABLE likes(
   id_user INT NOT NULL,
   id_article INT NOT NULL,
   is_liked TINYINT NOT NULL,
   PRIMARY KEY(id_user, id_article),
   FOREIGN KEY(id_user) REFERENCES users(id_user) ON DELETE CASCADE,
   FOREIGN KEY(id_article) REFERENCES articles(id_article) ON DELETE CASCADE
);

-- Remplir la table genre
INSERT INTO `genres`(`id_genre`,`name`) VALUES
    (28,'Action'),
    (12,'Aventure'),
    (16,'Animation'),
    (35,'Comédie'),
    (80,'Crime'),
    (99,'Documentaire'),
    (18,'Drame'),
    (10751,'Familial'),
    (14,'Fantastique'),
    (36,'Histoire'),
    (27,'Horreur'),
    (10402,'Musique'),
    (9648,'Mystère'),
    (10749,'Romance'),
    (878,'Science-Fiction'),
    (10770,'Téléfilm'),
    (53,'Thriller'),
    (10752,'Guerre'),
    (10759,'Action & Aventure'),
    (10762,'Kids'),
    (10763,'News'),
    (10764,'Reality'),
    (10765,'Science-Fiction & Fantastique'),
    (10766,'Soap'),
    (10767,'Talk'),
    (10768,'War & Politics'),
    (37,'Western');
