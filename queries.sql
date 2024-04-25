
CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100),
    firstname VARCHAR(100),
    lastname VARCHAR(100)
)

-- Table for capitals
CREATE TABLE capitals (
    id SERIAL PRIMARY KEY,
    country VARCHAR(255),
    capital VARCHAR(255)
);
