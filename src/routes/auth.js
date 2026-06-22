const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

router.post('/login', async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await Utilisateur.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
    const ok = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!ok) return res.status(401).json({ message: 'Identifiants invalides' });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ token, user: { id: user.id, nom: user.nom, role: user.role } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;