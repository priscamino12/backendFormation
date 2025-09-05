const mysql = require("mysql2/promise");
require("dotenv").config();
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });

    // Créer la base si elle n'existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    // Sélectionner la base
    await connection.query(`USE ${process.env.DB_NAME}`);

    // Créer la table 'user'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pseudo VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        mdp VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table 'client'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS client (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        contact VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer la table 'participant'
    await connection.query(`
      CREATE TABLE IF NOT EXISTS participant (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        contact VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.end();
    return { msg: "Base de données et tables créées" };
  } catch (err) {
    return { msg: "Erreur lors de la création de la DB", error: err.message };
  }
}

// Exécution directe pour test
if (require.main === module) {
  setupDatabase()
    .then(console.log)
    .catch(console.error);
}

module.exports = { setupDatabase };
