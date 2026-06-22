const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Client = sequelize.define('Client', {
  nom: { type: DataTypes.STRING, allowNull: false },
  compagnie: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  transitaire: { type: DataTypes.STRING },
});

module.exports = Client;