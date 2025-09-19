-- SQL script to create initial tables (MySQL)
CREATE DATABASE IF NOT EXISTS clinicdb;
USE clinicdb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(150) UNIQUE,
  password VARCHAR(255),
  role ENUM('patient','secretary') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  secretary_id INT NULL,
  date DATE,
  time TIME,
  cep VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(50),
  weather_info VARCHAR(255),
  status ENUM('scheduled','cancelled','done') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL
);
