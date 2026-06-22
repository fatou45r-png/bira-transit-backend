const express = require('express');
const router = express.Router();
const Facture = require('../models/Facture');
const Client = require('../models/Client');
const { authMiddleware } = require('../middleware/auth');

// Générer numéro automatique
async function genererNumero() {
  const count = await Facture.count();
  return `${String(count + 1).padStart(4, '0')}`;
}

// GET toutes les factures
router.get('/', authMiddleware, async (req, res) => {
  const factures = await Facture.findAll({
    include: Client,
    order: [['createdAt', 'DESC']],
  });
  res.json(factures);
});

// GET une facture
router.get('/:id', authMiddleware, async (req, res) => {
  const f = await Facture.findByPk(req.params.id, { include: Client });
  if (!f) return res.status(404).json({ message: 'Facture introuvable' });
  res.json(f);
});

// POST nouvelle facture
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { prixHT, fraisImp = 1500, ...rest } = req.body;
    const tva = Math.round(prixHT * 0.18);
    const total = prixHT + tva + fraisImp;
    const numeroFacture = await genererNumero();
    const facture = await Facture.create({
      ...rest, prixHT, fraisImp, tva, total, numeroFacture,
    });
    res.status(201).json(facture);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// PUT modifier facture
router.put('/:id', authMiddleware, async (req, res) => {
  const f = await Facture.findByPk(req.params.id);
  if (!f) return res.status(404).json({ message: 'Facture introuvable' });
  const { prixHT, fraisImp = f.fraisImp } = req.body;
  const tva = prixHT ? Math.round(prixHT * 0.18) : f.tva;
  const total = (prixHT || f.prixHT) + tva + fraisImp;
  await f.update({ ...req.body, tva, total });
  res.json(f);
});

// DELETE supprimer
router.delete('/:id', authMiddleware, async (req, res) => {
  const f = await Facture.findByPk(req.params.id);
  if (!f) return res.status(404).json({ message: 'Facture introuvable' });
  await f.destroy();
  res.json({ message: 'Facture supprimée' });
});

module.exports = router;