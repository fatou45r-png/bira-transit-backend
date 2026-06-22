const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Tarif = sequelize.define('Tarif', {
  destination: { type: DataTypes.STRING, allowNull: false },
  distanceKm: { type: DataTypes.INTEGER },
  // Conteneur 20'
  ht20: { type: DataTypes.INTEGER, allowNull: false },
  ttc20: { type: DataTypes.INTEGER, allowNull: false },
  // Conteneur 40'
  ht40: { type: DataTypes.INTEGER, allowNull: false },
  ttc40: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Tarif;