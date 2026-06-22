const express = require('express');
const cors = require('cors');
const sequelize = require('./models/index');
require('dotenv').config();

// IMPORTATION DES MODÈLES
const Utilisateur = require('./models/Utilisateur');
const Client = require('./models/Client');
const Tarif = require('./models/Tarif');
const Facture = require('./models/Facture');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// ROUTES DE L'API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/factures', require('./routes/factures'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/tarifs', require('./routes/tarifs'));

// ROUTE DE SEED - Injection de la grille tarifaire LCP de Bira Transit
app.get('/api/seed-database', async (req, res) => {
  try {
    const count = await Tarif.count();
    
    if (count > 0) {
      return res.json({ message: "La base de données contient déjà les tarifs LCP !" });
    }

    const tarifsLCP = [
      { destination: 'ZONE 1', distanceKm: 18, ht20: 70000, ttc20: 84600, ht40: 105000, ttc40: 125900 },
      { destination: 'ZONE 2', distanceKm: 38, ht20: 115000, ttc20: 137700, ht40: 185000, ttc40: 220300 },
      { destination: 'THIES/KAYAR/TOUBAB DIALAW', distanceKm: 71, ht20: 128000, ttc20: 153040, ht40: 211000, ttc40: 250980 },
      { destination: 'POPEGUINE', distanceKm: 71, ht20: 128000, ttc20: 153040, ht40: 211000, ttc40: 250980 },
      { destination: 'KIRENE/DIASS', distanceKm: 72, ht20: 128000, ttc20: 153040, ht40: 211000, ttc40: 250980 },
      { destination: 'THIAYE/FENDENE', distanceKm: 80, ht20: 137000, ttc20: 229000, ht40: 163660, ttc40: 272220 },
      { destination: 'MBOUR/SINDIA/NGUEKHOKH', distanceKm: 83, ht20: 140000, ttc20: 167200, ht40: 235000, ttc40: 279300 },
      { destination: 'TIVAOUANE/SANDIARA/KHOMBOLE', distanceKm: 95, ht20: 152000, ttc20: 181340, ht40: 259000, ttc40: 307620 },
      { destination: 'MECKHE', distanceKm: 118, ht20: 175000, ttc20: 208500, ht40: 305000, ttc40: 361900 },
      { destination: 'BAMBAY', distanceKm: 125, ht20: 182000, ttc20: 216760, ht40: 319000, ttc40: 378420 },
      { destination: 'TAIBA', distanceKm: 125, ht20: 182000, ttc20: 216760, ht40: 319000, ttc40: 378420 },
      { destination: 'JOAL/NGEDIENE', distanceKm: 134, ht20: 191000, ttc20: 227380, ht40: 337000, ttc40: 399660 },
      { destination: 'DIOURBEL', distanceKm: 139, ht20: 203000, ttc20: 241540, ht40: 361000, ttc40: 427980 },
      { destination: 'FATICK/DJIFFER', distanceKm: 155, ht20: 212000, ttc20: 252160, ht40: 379000, ttc40: 449220 },
      { destination: 'KEBEMER', distanceKm: 155, ht20: 212000, ttc20: 252160, ht40: 379000, ttc40: 449220 },
      { destination: 'MBACKE', distanceKm: 180, ht20: 243000, ttc20: 288740, ht40: 441000, ttc40: 522380 },
      { destination: 'KAOLACK/NDOFFANE', distanceKm: 187, ht20: 246000, ttc20: 292280, ht40: 447000, ttc40: 529460 },
      { destination: 'LOUGA', distanceKm: 194, ht20: 251000, ttc20: 298180, ht40: 457000, ttc40: 541260 },
      { destination: 'TOUBA', distanceKm: 194, ht20: 251000, ttc20: 298180, ht40: 457000, ttc40: 541260 },
      { destination: 'SOKONE/SAKAL', distanceKm: 234, ht20: 291000, ttc20: 345380, ht40: 537000, ttc40: 635660 },
      { destination: 'KAFFRINE/POROKHANE/KEUR MOMAR', distanceKm: 247, ht20: 304000, ttc20: 360720, ht40: 563000, ttc40: 666340 },
      { destination: 'NIORO', distanceKm: 260, ht20: 325000, ttc20: 385500, ht40: 605000, ttc40: 715900 },
      { destination: 'SAINT LOUIS', distanceKm: 260, ht20: 325000, ttc20: 385500, ht40: 605000, ttc40: 715900 },
      { destination: 'RICHARD TOLL/ROSS BETHIO/BANJUL', distanceKm: 365, ht20: 433000, ttc20: 512940, ht40: 821000, ttc40: 970780 },
      { destination: 'DAGANA', distanceKm: 407, ht20: 464000, ttc20: 549520, ht40: 883000, ttc40: 1043940 },
      { destination: 'MAKA', distanceKm: 407, ht20: 464000, ttc20: 549520, ht40: 883000, ttc40: 1043940 },
      { destination: 'BIGNONA', distanceKm: 427, ht20: 583000, ttc20: 689940, ht40: 1070000, ttc40: 1264600 },
      { destination: 'ZIGUINCHOR', distanceKm: 454, ht20: 570000, ttc20: 674600, ht40: 1140000, ttc40: 1347200 },
      { destination: 'TAMBACOUNDA', distanceKm: 467, ht20: 524000, ttc20: 620320, ht40: 1003000, ttc40: 1185540 },
      { destination: 'PODOR/NDIOUM', distanceKm: 487, ht20: 544000, ttc20: 643920, ht40: 1043000, ttc40: 1232740 },
      { destination: 'CAP SKIRING/GUEDE', distanceKm: 497, ht20: 625000, ttc20: 739500, ht40: 1250000, ttc40: 1477000 },
      { destination: 'GOUDIRY', distanceKm: 575, ht20: 632000, ttc20: 747760, ht40: 1219000, ttc40: 1440420 },
      { destination: 'VELINGARA/AGNAM', distanceKm: 575, ht20: 632000, ttc20: 747760, ht40: 1219000, ttc40: 1440420 },
      { destination: 'ROSSO', distanceKm: 604, ht20: 661000, ttc20: 781980, ht40: 1277000, ttc40: 1508860 },
      { destination: 'NIOKOLO', distanceKm: 604, ht20: 661000, ttc20: 781980, ht40: 1277000, ttc40: 1508860 },
      { destination: 'KOLDA', distanceKm: 0, ht20: 750000, ttc20: 887000, ht40: 1455000, ttc40: 1718900 },
      { destination: 'KEDOUGOU/BAKEL', distanceKm: 0, ht20: 759000, ttc20: 897620, ht40: 1473000, ttc40: 1740140 },
      { destination: 'KIDIRA/BISSAU', distanceKm: 0, ht20: 820000, ttc20: 969600, ht40: 1600000, ttc40: 1890000 }
    ];

    await Tarif.bulkCreate(tarifsLCP);
    res.json({ message: "Grille tarifaire LCP injectée avec succès en ligne ! 🚀" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ROUTE PAR DÉFAUT (Pour éviter le "Cannot GET /" brut)
app.get('/', (req, res) => {
  res.send('<h1>Bira Transit API est en ligne et fonctionnelle ! 🚀</h1>');
});

const PORT = process.env.PORT || 3000;

// SYNCHRONISATION ET LANCEMENT DU SERVEUR
sequelize.sync({ alter: true }).then(async () => {
  console.log('Base de données PostgreSQL synchronisée.');

  // Création automatique du compte administrateur initial si absent
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
      console.log('Compte admin initial généré : admin@biratransit.sn / admin123');
    }
  } catch (err) {
    console.error("Erreur d'initialisation de l'administrateur:", err.message);
  }

  // Lancement de l'écoute globale
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serveur actif sur le port ${PORT}`);
  });
}).catch(err => {
  console.error('Impossible de synchroniser la base de données:', err.message);
});