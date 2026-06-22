const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Utilisateur = sequelize.define('Utilisateur', {
  nom: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  motDePasse: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'agent'), defaultValue: 'agent' },
});

module.exports = Utilisateur;