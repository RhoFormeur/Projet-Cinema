CREATE TABLE users(
   id_user INT AUTO_INCREMENT,
   firstname VARCHAR(45) NOT NULL,
   lastname VARCHAR(45) NOT NULL,
   email VARCHAR(45) NOT NULL,
   password VARCHAR(45) NOT NULL,
   image_user MEDIUMBLOB,
   username VARCHAR(45) NOT NULL,
   is_admin TINYINT NOT NULL DEFAULT 0,
   is_ban TINYINT NOT NULL DEFAULT 0,
   is_verified TINYINT NOT NULL DEFAULT 0,
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
   is_reported TINYINT NOT NULL DEFAULT 0,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_user INT NOT NULL,
   PRIMARY KEY(id_article),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE comments(
   id_comment INT AUTO_INCREMENT,
   content TEXT NOT NULL,
   is_reported TINYINT NOT NULL DEFAULT 0,
   created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
   id_article INT NOT NULL,
   id_user INT NOT NULL,
   PRIMARY KEY(id_comment),
   FOREIGN KEY(id_article) REFERENCES articles(id_article),
   FOREIGN KEY(id_user) REFERENCES users(id_user)
);

CREATE TABLE genres(
   id_genre INT NOT NULL,
   name VARCHAR(45) NOT NULL,
   PRIMARY KEY(id_genre)
);

CREATE TABLE articles_genres(
   id_article INT NOT NULL,
   id_genre INT NOT NULL,
   PRIMARY KEY(id_article, id_genre),
   FOREIGN KEY(id_article) REFERENCES articles(id_article),
   FOREIGN KEY(id_genre) REFERENCES genres(id_genre)
);

CREATE TABLE likes(
   id_user INT NOT NULL,
   id_article INT NOT NULL,
   is_liked TINYINT NOT NULL,
   PRIMARY KEY(id_user, id_article),
   FOREIGN KEY(id_user) REFERENCES users(id_user),
   FOREIGN KEY(id_article) REFERENCES articles(id_article)
);
