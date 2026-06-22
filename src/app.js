const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
require('dotenv').config();

require('./models/Utilisateur');
require('./models/Client');
require('./models/Tarif');
require('./models/Facture');

const app = express();

// CORS ouvert pour les tests (on restreindra après)
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/factures', require('./routes/factures'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/tarifs', require('./routes/tarifs'));

// Route santé pour Render
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
  // Seed automatique si la base est vide
  const { Utilisateur } = require('./models/Utilisateur');
  const count = await Utilisateur.count().catch(() => 0);
  if (count === 0) {
    console.log('Base vide → seed automatique...');
    require('./seed'); // on adapte seed.js juste après
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
});