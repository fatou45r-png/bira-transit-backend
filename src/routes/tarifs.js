const express = require('express');
const router = express.Router();
const Tarif = require('../models/Tarif');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  const tarifs = await Tarif.findAll({ order: [['destination', 'ASC']] });
  res.json(tarifs);
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  const t = await Tarif.findByPk(req.params.id);
  if (!t) return res.status(404).json({ message: 'Tarif introuvable' });
  await t.update(req.body);
  res.json(t);
});

module.exports = router;