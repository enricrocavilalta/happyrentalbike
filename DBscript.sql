-- CREATE DATABASE happyrental;

USE happyrental;

CREATE TABLE tours (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_per_hour DECIMAL(6,2),
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DESCRIBE bikes;
INSERT INTO tours (name, description, price_per_hour, image_url)
VALUES
  ('City Tour', 'Explore the city landmarks', 15, 'https://example.com/image1.jpg'),
  ('Mountain Hike', 'Guided mountain hiking tour', 25, 'https://example.com/image2.jpg'),
  ('Beach Walk', 'Relaxing beach walking tour', 10, 'https://example.com/image3.jpg');
ALTER TABLE bikes MODIFY price_per_hour VARCHAR(255);
UPDATE bikes SET price_per_hour = TRIM(TRAILING '.00' FROM price_per_hour) WHERE price_per_hour LIKE '%.00';
select image_url from bikes

USE happyrental;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
describe users;
SELECT * FROM users;
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  bike_id INT NOT NULL,
  quantity INT DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (bike_id) REFERENCES bikes(id)
);
describe cart;
drop table cart;
describe cart;

