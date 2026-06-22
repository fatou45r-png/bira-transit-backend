const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  console.log("Tentative de connexion à la base de données distante...");
  
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Indispensable pour Render
      }
    }
  });
} else {
  // Configuration pour ton PC en local
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    }
  );
}

// Petit test de diagnostic au démarrage
sequelize.authenticate()
  .then(() => console.log('Connexion à PostgreSQL réussie !'))
  .catch(err => {
    console.error('Échec de la connexion initiale avec SSL, tentative sans SSL...', err.message);
    // Si la connexion échoue à cause du SSL interne de Render, on tente un fallback sans SSL
    if (process.env.DATABASE_URL) {
      sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        logging: false,
        dialectOptions: {}
      });
    }
  });

module.exports = sequelize;