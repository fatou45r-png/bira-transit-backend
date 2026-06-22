const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Client = require('./Client');

const Facture = sequelize.define('Facture', {
  numeroFacture: { type: DataTypes.STRING, allowNull: false, unique: true },
  dateFacture: { type: DataTypes.DATEONLY, allowNull: false },
  representant: { type: DataTypes.STRING, defaultValue: 'BIRA TRANSIT' },
  zone: { type: DataTypes.STRING },
  typeOperation: { type: DataTypes.STRING }, // ex: DEPOTAGE
  // Ligne 1 (conteneur)
  ref1: { type: DataTypes.STRING },        // ex: Z1 40P
  description1: { type: DataTypes.STRING }, // ex: CAAU9337877
  typeConteneur: { type: DataTypes.STRING }, // '20' ou '40'
  prixHT: { type: DataTypes.INTEGER, allowNull: false },
  // Ligne 2 (frais)
  ref2: { type: DataTypes.STRING, defaultValue: 'F-IMP' },
  description2: { type: DataTypes.STRING, defaultValue: "FRAIS D'IMPRIMES" },
  fraisImp: { type: DataTypes.INTEGER, defaultValue: 1500 },
  // Calculs
  tvaRate: { type: DataTypes.FLOAT, defaultValue: 18 },
  tva: { type: DataTypes.INTEGER },
  total: { type: DataTypes.INTEGER },
  statut: { type: DataTypes.ENUM('brouillon', 'payée'), defaultValue: 'brouillon' },
});

Facture.belongsTo(Client, { foreignKey: 'clientId' });
Client.hasMany(Facture, { foreignKey: 'clientId' });

module.exports = Facture;