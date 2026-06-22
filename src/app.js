const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
require('dotenv').config();

// IMPORTATION DES MODÈLES (Vérifie bien que ces lignes existent !)
const Utilisateur = require('./models/Utilisateur');
const Client = require('./models/Client');
const Tarif = require('./models/Tarif');
const Facture = require('./models/Facture');

const app = express();

app.use(cors());
app.use(express.json());

// Routes de l'API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/factures', require('./routes/factures'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/tarifs', require('./routes/tarifs'));

const PORT = process.env.PORT || 3000;

// Synchronisation avec la base de données PostgreSQL
sequelize.sync({ alter: true }).then(async () => {
  console.log('Base de données synchronisée');
  
  // Si tu as un bloc automatique pour créer un admin s'il n'existe pas, il utilise Utilisateur ici :
  try {
    const count = await Utilisateur.count();
    if (count === 0) {
      const bcrypt = require('bcryptjs');
      const mdpHache = await bcrypt.hash('admin123', 10);
      await Utilisateur.create({
        nom: 'Administrateur',
        email: 'admin@biratransit.sn',
        motDePasse: mdpHache,
        role: 'admin'
      });
      console.log('Compte administrateur initial créé ! (admin@biratransit.sn / admin123)');
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'admin initial:", error.message);
  }

  // Lancement du serveur
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}).catch(err => {
  console.error('Impossible de synchroniser la base de données:', err.message);
});